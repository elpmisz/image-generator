import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { promptTemplates } from "@/db/schema";
import { generateId } from "@/lib/utils";

const seedPrompts = [
  {
    id: generateId(),
    name: "Cyberpunk Portrait",
    description:
      "Futuristic portrait with neon lights and cybernetic enhancements",
    promptText:
      "A futuristic portrait of a person with cybernetic implants, neon blue and pink lighting reflecting on their face, wearing high-tech tactical gear",
    style: "digital-art",
    lighting: "neon",
    mood: "dramatic",
    action: "looking-at-camera",
    camera: "portrait",
    colorPalette: "blue,pink,purple",
    aspectRatio: "1:1",
    quality: "2k",
    negativePrompt: "blurry, low quality, distorted",
    exampleImage: "",
  },
  {
    id: generateId(),
    name: "Fantasy Landscape",
    description: "Magical landscape with floating islands and ancient ruins",
    promptText:
      "A breathtaking fantasy landscape with floating islands in the sky, ancient stone ruins with glowing runes, waterfalls cascading into clouds, golden hour lighting",
    style: "digital-art",
    lighting: "golden-hour",
    mood: "mysterious",
    action: "static",
    camera: "wide-angle",
    colorPalette: "gold,blue,green",
    aspectRatio: "16:9",
    quality: "2k",
    negativePrompt: "modern buildings, cars, power lines",
    exampleImage: "",
  },
  {
    id: generateId(),
    name: "Anime Character",
    description: "Stylized anime character with vibrant colors",
    promptText:
      "A young anime character with spiky hair, expressive eyes, wearing a school uniform, standing in a cherry blossom garden, petals falling around them",
    style: "anime",
    lighting: "natural",
    mood: "peaceful",
    action: "standing",
    camera: "medium-shot",
    colorPalette: "pink,white,blue",
    aspectRatio: "3:4",
    quality: "2k",
    negativePrompt: "realistic, 3d render",
    exampleImage: "",
  },
  {
    id: generateId(),
    name: "Product Photography",
    description: "Professional product shot with studio lighting",
    promptText:
      "Professional product photography of a sleek modern water bottle, studio lighting with soft shadows, clean white background, high contrast",
    style: "photorealistic",
    lighting: "studio",
    mood: "bright",
    action: "static",
    camera: "macro",
    colorPalette: "white,silver,blue-accent",
    aspectRatio: "1:1",
    quality: "2k",
    negativePrompt: "cluttered, dark, blurry",
    exampleImage: "",
  },
  {
    id: generateId(),
    name: "Oil Painting Portrait",
    description: "Classic oil painting style portrait",
    promptText:
      "Classic oil painting portrait of an elderly person with deep wrinkles, warm candlelight illuminating their face, rich textures visible in brushstrokes, dark background",
    style: "oil-painting",
    lighting: "candlelight",
    mood: "nostalgic",
    action: "looking-away",
    camera: "portrait",
    colorPalette: "brown,gold,dark-red",
    aspectRatio: "4:3",
    quality: "2k",
    negativePrompt: "photorealistic, digital, clean lines",
    exampleImage: "",
  },
  {
    id: generateId(),
    name: "Sci-Fi Cityscape",
    description: "Futuristic city with flying vehicles and holograms",
    promptText:
      "Massive futuristic cityscape at night, towering skyscrapers with holographic advertisements, flying vehicles zooming between buildings, neon lights everywhere",
    style: "digital-art",
    lighting: "neon",
    mood: "energetic",
    action: "static",
    camera: "wide-angle",
    colorPalette: "neon-blue,magenta,cyan",
    aspectRatio: "21:9",
    quality: "2k",
    negativePrompt: "daytime, old buildings, cars",
    exampleImage: "",
  },
  {
    id: generateId(),
    name: "Watercolor Nature",
    description: "Soft watercolor painting of a mountain landscape",
    promptText:
      "Soft watercolor painting of misty mountains at sunrise, gentle gradient from purple to orange, pine trees in silhouette, serene lake reflecting the sky",
    style: "watercolor",
    lighting: "soft",
    mood: "serene",
    action: "static",
    camera: "wide-angle",
    colorPalette: "purple,orange,blue,green",
    aspectRatio: "16:9",
    quality: "2k",
    negativePrompt: "sharp edges, photorealistic, dark",
    exampleImage: "",
  },
  {
    id: generateId(),
    name: "3D Character Render",
    description: "High-quality 3D character render",
    promptText:
      "High-quality 3D render of a fantasy warrior character, detailed armor with intricate patterns, dynamic pose with sword raised, dramatic rim lighting",
    style: "3d-render",
    lighting: "rim-lighting",
    mood: "epic",
    action: "battle-pose",
    camera: "low-angle",
    colorPalette: "silver,red,gold",
    aspectRatio: "9:16",
    quality: "2k",
    negativePrompt: "2d, flat, cartoon",
    exampleImage: "",
  },
];

export async function POST() {
  try {
    let createdCount = 0;

    for (const prompt of seedPrompts) {
      await db.insert(promptTemplates).values({
        ...prompt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      createdCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdCount} prompt templates`,
      count: createdCount,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to seed database",
      },
      { status: 500 },
    );
  }
}
