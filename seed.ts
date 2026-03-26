import { db } from "./src/db/client";
import { promptTemplates } from "./src/db/schema";
import { generateId } from "./src/lib/utils";

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
    action: "looking at camera",
    camera: "portrait",
    colorPalette: "blue, pink, purple",
    aspectRatio: "1:1",
    quality: "hd",
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
    lighting: "golden hour",
    mood: "mystical",
    action: "static scene",
    camera: "wide angle",
    colorPalette: "gold, blue, green",
    aspectRatio: "16:9",
    quality: "4k",
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
    lighting: "soft natural",
    mood: "peaceful",
    action: "standing",
    camera: "medium shot",
    colorPalette: "pink, white, blue",
    aspectRatio: "3:4",
    quality: "hd",
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
    mood: "professional",
    action: "static",
    camera: "macro",
    colorPalette: "white, silver, blue accent",
    aspectRatio: "1:1",
    quality: "4k",
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
    action: "looking away",
    camera: "portrait",
    colorPalette: "brown, gold, dark red",
    aspectRatio: "4:3",
    quality: "standard",
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
    lighting: "night neon",
    mood: "energetic",
    action: "dynamic scene",
    camera: "wide angle",
    colorPalette: "neon blue, magenta, cyan",
    aspectRatio: "21:9",
    quality: "4k",
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
    lighting: "soft dawn",
    mood: "serene",
    action: "static landscape",
    camera: "wide angle",
    colorPalette: "purple, orange, blue, green",
    aspectRatio: "16:9",
    quality: "hd",
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
    lighting: "dramatic rim",
    mood: "epic",
    action: "battle pose",
    camera: "dynamic angle",
    colorPalette: "silver, red, gold",
    aspectRatio: "9:16",
    quality: "4k",
    negativePrompt: "2d, flat, cartoon",
    exampleImage: "",
  },
];

async function seed() {
  console.log("Seeding prompt templates...");

  try {
    for (const prompt of seedPrompts) {
      await db.insert(promptTemplates).values({
        ...prompt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✓ Created: ${prompt.name}`);
    }

    console.log("\n✅ Seed completed successfully!");
    console.log(`Created ${seedPrompts.length} prompt templates`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
