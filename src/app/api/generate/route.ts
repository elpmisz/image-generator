import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/client";
import { promptTemplates, generations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateImage } from "@/lib/gemini";
import { buildPrompt } from "@/lib/promptBuilder";
import { saveGeneration, getPublicUrl } from "@/lib/storage";
import { generateId } from "@/lib/utils";

const generateSchema = z.object({
  templateId: z.string(),
  promptText: z.string().optional(),
  style: z.string().optional(),
  aspectRatio: z.string().optional(),
  quality: z.string().optional(),
  negativePrompt: z.string().optional(),
  characterImages: z.array(z.string()).optional(),
  elementImages: z.array(z.string()).optional(),
  overrides: z
    .object({
      lighting: z.string().optional(),
      mood: z.string().optional(),
      action: z.string().optional(),
      camera: z.string().optional(),
      colorPalette: z.string().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      templateId,
      promptText,
      style,
      aspectRatio,
      quality,
      negativePrompt,
      characterImages,
      elementImages,
      overrides,
    } = generateSchema.parse(body);

    const templates = await db
      .select()
      .from(promptTemplates)
      .where(eq(promptTemplates.id, templateId))
      .limit(1);

    if (!templates.length) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    const template = templates[0];
    const prompt = buildPrompt(
      {
        promptText: promptText || template.promptText,
        style: style || template.style,
        lighting: overrides?.lighting ?? template.lighting ?? undefined,
        mood: overrides?.mood ?? template.mood ?? undefined,
        action: overrides?.action ?? template.action ?? undefined,
        camera: overrides?.camera ?? template.camera ?? undefined,
        colorPalette:
          overrides?.colorPalette ?? template.colorPalette ?? undefined,
        aspectRatio: aspectRatio || template.aspectRatio,
        quality: quality || template.quality,
        negativePrompt: negativePrompt ?? template.negativePrompt ?? undefined,
      },
      {},
    );

    const result = await generateImage(
      prompt,
      characterImages || [],
      elementImages || [],
      {
        aspectRatio: aspectRatio || template.aspectRatio,
      },
    );
    const imagePath = await saveGeneration(result.base64, result.mimeType);
    const imageUrl = getPublicUrl(imagePath);

    const generationId = generateId();
    await db.insert(generations).values({
      id: generationId,
      templateId,
      prompt,
      characterImages: characterImages ? JSON.stringify(characterImages) : null,
      elementImages: elementImages ? JSON.stringify(elementImages) : null,
      overrides: overrides ? JSON.stringify(overrides) : null,
      imageUrl,
      status: "completed",
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: generationId,
      prompt,
      imageUrl,
      status: "completed",
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate image",
      },
      { status: 500 },
    );
  }
}
