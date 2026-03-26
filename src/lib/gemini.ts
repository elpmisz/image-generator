import { GoogleGenAI } from "@google/genai";
import { readFile } from "fs/promises";
import { extname, join } from "path";

const apiKey =
  process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  throw new Error(
    "Missing Google AI API key. Set GOOGLE_AI_API_KEY or GEMINI_API_KEY in your environment.",
  );
}

const ai = new GoogleGenAI({ apiKey });

const DEFAULT_REFERENCE_MODEL = "gemini-3.1-flash-image-preview";

const EXT_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function getMimeTypeFromPathOrUrl(pathOrUrl: string) {
  const ext = extname(pathOrUrl).toLowerCase();
  return EXT_MIME[ext] || "image/jpeg";
}

async function fetchImageBytes(pathOrUrl: string): Promise<string> {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    const res = await fetch(pathOrUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch reference image: ${pathOrUrl}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return buffer.toString("base64");
  }

  // Local path: /storage/uploads/... or /storage/generations/...
  const cleaned = pathOrUrl.startsWith("/") ? pathOrUrl.slice(1) : pathOrUrl;
  const filePath = join(process.cwd(), "public", cleaned);
  const buffer = await readFile(filePath);
  return buffer.toString("base64");
}

async function loadReferenceImage(pathOrUrl: string) {
  return {
    imageBytes: await fetchImageBytes(pathOrUrl),
    mimeType: getMimeTypeFromPathOrUrl(pathOrUrl),
  };
}

function buildReferencePrompt(prompt: string) {
  return `Create a photorealistic image that follows the user's request and strictly combines all uploaded reference images.
- Preserve the real facial identity and visual characteristics of the uploaded character references.
- Integrate all uploaded element references exactly into the final composition.
- Make the character and element references appear naturally in the same scene.
- Do not ignore any uploaded reference image.
- Keep the result clean, realistic, and compositionally coherent.

User request:
${prompt}`;
}

export interface GenerateImageResult {
  base64: string;
  mimeType: string;
}

export async function generateImage(
  prompt: string,
  characterImages: string[] = [],
  elementImages: string[] = [],
  options?: {
    aspectRatio?: string;
  },
): Promise<GenerateImageResult> {
  const hasReferenceInputs =
    characterImages.length > 0 || elementImages.length > 0;

  try {
    const validCharacters = characterImages.filter(Boolean);
    const validElements = elementImages.filter(Boolean);

    const parts: Array<
      { text: string } | { inline_data: { mime_type: string; data: string } }
    > = [{ text: hasReferenceInputs ? buildReferencePrompt(prompt) : prompt }];

    if (validCharacters.length > 0) {
      parts.push({ text: "Character reference images:" });
      for (const imagePath of validCharacters) {
        const reference = await loadReferenceImage(imagePath);
        parts.push({
          inline_data: {
            mime_type: reference.mimeType,
            data: reference.imageBytes,
          },
        });
      }
    }

    if (validElements.length > 0) {
      parts.push({ text: "Element reference images:" });
      for (const imagePath of validElements) {
        const reference = await loadReferenceImage(imagePath);
        parts.push({
          inline_data: {
            mime_type: reference.mimeType,
            data: reference.imageBytes,
          },
        });
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_REFERENCE_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      const message =
        data?.error?.message || "Reference image generation failed";
      throw new Error(message);
    }

    const generatedParts = data?.candidates?.[0]?.content?.parts ?? [];
    for (const part of generatedParts) {
      if (part?.inlineData?.data && part?.inlineData?.mimeType) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }

    throw new Error("No image generated");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Reference image generation is unavailable in this environment: ${message}`,
    );
  }
}
