import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db/client";
import { promptTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";

const updatePromptSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  promptText: z.string().min(1).optional(),
  style: z.string().min(1).optional(),
  lighting: z.string().optional(),
  mood: z.string().optional(),
  action: z.string().optional(),
  camera: z.string().optional(),
  colorPalette: z.string().optional(),
  aspectRatio: z.string().min(1).optional(),
  quality: z.string().min(1).optional(),
  negativePrompt: z.string().optional(),
  exampleImage: z.string().optional(),
});

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const body = await req.json();
    const data = updatePromptSchema.parse(body);

    await db
      .update(promptTemplates)
      .set({
        ...data,
        quality: "2k",
        updatedAt: new Date(),
      })
      .where(eq(promptTemplates.id, params.id));

    const templates = await db
      .select()
      .from(promptTemplates)
      .where(eq(promptTemplates.id, params.id));

    if (!templates.length) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(templates[0]);
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update prompt",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    await db.delete(promptTemplates).where(eq(promptTemplates.id, params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 },
    );
  }
}
