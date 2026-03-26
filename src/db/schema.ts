import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const promptTemplates = sqliteTable("prompt_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  promptText: text("prompt_text").notNull(),
  style: text("style").notNull(),
  lighting: text("lighting"),
  mood: text("mood"),
  action: text("action"),
  camera: text("camera"),
  colorPalette: text("color_palette"),
  aspectRatio: text("aspect_ratio").notNull(),
  quality: text("quality").notNull(),
  negativePrompt: text("negative_prompt"),
  exampleImage: text("example_image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const generations = sqliteTable("generations", {
  id: text("id").primaryKey(),
  templateId: text("template_id").references(() => promptTemplates.id),
  prompt: text("prompt").notNull(),
  characterImages: text("character_images"),
  elementImages: text("element_images"),
  overrides: text("overrides"),
  imageUrl: text("image_url"),
  status: text("status").notNull(),
  error: text("error"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
