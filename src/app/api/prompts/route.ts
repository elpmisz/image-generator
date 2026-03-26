import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/client";
import { promptTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

const createPromptSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  promptText: z.string().min(1),
  style: z.string().min(1),
  lighting: z.string().optional(),
  mood: z.string().optional(),
  action: z.string().optional(),
  camera: z.string().optional(),
  colorPalette: z.string().optional(),
  aspectRatio: z.string().min(1),
  quality: z.string().min(1).optional(),
  negativePrompt: z.string().optional(),
  exampleImage: z.string().optional(),
});

export async function GET() {
  try {
    const templates = await db
      .select()
      .from(promptTemplates)
      .orderBy(promptTemplates.createdAt);
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createPromptSchema.parse(body);

    const id = generateId();
    const now = new Date();

    await db.insert(promptTemplates).values({
      id,
      ...data,
      quality: "2k",
      createdAt: now,
      updatedAt: now,
    });

    const templates = await db
      .select()
      .from(promptTemplates)
      .where(eq(promptTemplates.id, id));
    return NextResponse.json(templates[0], { status: 201 });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create prompt",
      },
      { status: 500 },
    );
  }
}
