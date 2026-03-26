# AI Image Generator Platform

Architecture and implementation guide for an image generation app built with Next.js 16, Bun, Drizzle ORM, SQLite, and local file storage.

## Overview

This project is designed to manage reusable prompt templates, upload reference images, generate AI images, and review generation history from a single dashboard.

The system is organized around three core workflows:

1. Create and manage prompt templates.
2. Upload reference images and generate new images.
3. Track usage, results, and performance over time.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | Next.js 16 App Router + TypeScript | Routing, SSR, and app structure |
| Runtime / Package Manager | Bun | Fast installs, scripts, and runtime execution |
| UI | Tailwind CSS + shadcn/ui | Fast, consistent component development |
| Database | SQLite | Lightweight relational storage |
| ORM | Drizzle ORM | Type-safe schema and SQL-first database access |
| Storage | Local file storage | Store uploads and generated images on disk |
| AI | Google Gemini API with Imagen 4 | Image generation and reference-image-based creation |
| State | Zustand | Client-side state for forms and generator workflows |
| Uploads | react-dropzone | Drag-and-drop multi-file uploads |
| Charts | Recharts | Usage and generation analytics |

## Product Goals

- Support reusable prompt templates for repeatable output quality.
- Allow multiple reference images for both characters and products.
- Keep generated images and prompt history linked to each user.
- Store files locally for simple development and self-hosted deployment.
- Expose a dashboard for usage analytics and recent activity.

## Target Project Structure

```text
/src
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── prompt/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── generator/page.tsx
│   ├── api/
│   │   ├── generate/route.ts
│   │   ├── prompts/route.ts
│   │   ├── prompts/[id]/route.ts
│   │   ├── upload/route.ts
│   │   └── dashboard/route.ts
│   └── layout.tsx
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── prompt/
│   └── generator/
├── db/
│   ├── schema.ts
│   ├── client.ts
│   └── migrations/
├── lib/
│   ├── gemini.ts
│   ├── promptBuilder.ts
│   ├── storage.ts
│   └── utils.ts
├── store/
│   └── generatorStore.ts
├── types/
└── storage/
    ├── uploads/
    └── generations/
```

## Data Model

Recommended Drizzle tables:

Use Bun's built-in SQLite module (`bun:sqlite`) with Drizzle for local development and self-hosted deployment.

```typescript
import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(Date.now()),
});

export const promptTemplates = sqliteTable("prompt_templates", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  promptText: text("prompt_text").notNull(),
  negativePrompt: text("negative_prompt"),
  style: text("style"),
  lighting: text("lighting"),
  mood: text("mood"),
  action: text("action"),
  camera: text("camera"),
  colorPalette: text("color_palette"),
  exampleImagePath: text("example_image_path"),
  aspectRatio: text("aspect_ratio").notNull().default("1:1"),
  quality: text("quality").notNull().default("standard"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(Date.now()),
});

export const generations = sqliteTable("generations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  promptTemplateId: text("prompt_template_id").references(() => promptTemplates.id),
  characterImagePaths: text("character_image_paths", { mode: "json" }).notNull(),
  elementImagePaths: text("element_image_paths", { mode: "json" }).notNull(),
  finalPrompt: text("final_prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  outputImagePath: text("output_image_path"),
  status: text("status").notNull().default("PENDING"),
  errorMessage: text("error_message"),
  processingMs: integer("processing_ms"),
  modelVersion: text("model_version"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(Date.now()),
});

export const userRelations = relations(users, ({ many }) => ({
  promptTemplates: many(promptTemplates),
  generations: many(generations),
}));
```

## API Design

### POST /api/generate

Generates an image from a selected prompt template, optional overrides, and reference images.

Request body example:

```json
{
  "promptTemplateId": "cuid",
  "characterImages": ["/storage/uploads/character-1.png"],
  "elementImages": ["/storage/uploads/product-1.png"],
  "overrides": {
    "lighting": "dramatic",
    "mood": "editorial"
  }
}
```

Processing flow:

1. Load the selected prompt template from SQLite.
2. Merge template values with request overrides.
3. Build the final prompt string.
4. Send the request and reference images to Gemini Imagen 4.
5. Save the generated image to local storage.
6. Store the generation record in the database.
7. Return the result to the client.

### Prompt Management

- GET /api/prompts: list the current user's prompt templates.
- POST /api/prompts: create a new prompt template.
- PUT /api/prompts/[id]: update an existing prompt template.
- DELETE /api/prompts/[id]: delete a prompt template.

### Dashboard

- GET /api/dashboard: return totals, recent generations, monthly usage, and success rate.

Example response:

```json
{
  "totalGenerations": 142,
  "totalPrompts": 12,
  "generationsThisMonth": 38,
  "successRate": 0.96,
  "avgProcessingMs": 4200,
  "recentGenerations": [],
  "dailyUsage": []
}
```

## Gemini / Imagen Integration

Suggested implementation pattern:

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  referenceImages: {
    type: "character" | "element";
    imageBase64: string;
    mimeType: string;
  }[];
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3";
}

export async function generateImage(params: GenerateImageParams) {
  const contents = [
    {
      role: "user",
      parts: [
        ...params.referenceImages
          .filter((image) => image.type === "character")
          .map((image) => ({
            inlineData: {
              mimeType: image.mimeType,
              data: image.imageBase64,
            },
          })),
        ...params.referenceImages
          .filter((image) => image.type === "element")
          .map((image) => ({
            inlineData: {
              mimeType: image.mimeType,
              data: image.imageBase64,
            },
          })),
        { text: params.prompt },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "imagen-4-generate-preview-06-06",
    contents,
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  });

  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part) => part.inlineData,
  );

  if (!imagePart?.inlineData) {
    throw new Error("No image in response");
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
  };
}
```

## Prompt Builder

Keep prompt assembly deterministic so results are easier to debug and repeat.

```typescript
export function buildPrompt(template: PromptTemplate, overrides?: Partial<PromptTemplate>): string {
  const merged = { ...template, ...overrides };
  const parts: string[] = [];

  if (merged.promptText) parts.push(merged.promptText);
  if (merged.style) parts.push(`Style: ${merged.style}`);
  if (merged.lighting) parts.push(`Lighting: ${merged.lighting}`);
  if (merged.mood) parts.push(`Mood: ${merged.mood}`);
  if (merged.action) parts.push(`Action: ${merged.action}`);
  if (merged.camera) parts.push(`Camera: ${merged.camera}`);
  if (merged.colorPalette) parts.push(`Color palette: ${merged.colorPalette}`);

  return parts.join(", ");
}
```

Recommended order:

1. Core subject and scene.
2. Style and visual tone.
3. Lighting and mood.
4. Action and camera framing.
5. Color and finishing details.

## Page Responsibilities

### Dashboard

- Key metrics: total generations, total prompts, success rate, and monthly activity.
- Recent generations list with thumbnails and timestamps.
- Usage chart for the last 30 days.
- Quick actions for creating prompts and launching the generator.

### Prompt Library

- Grid view of saved templates.
- Preview image, name, and style badges.
- Actions for edit, delete, and reuse in the generator.
- Create and edit forms for prompt text, style tags, and output settings.

### Generator

- Multi-image uploads for character and element references.
- Prompt template selection with preview cards.
- Optional overrides for lighting, mood, action, and camera.
- Result panel with loading state, generated image, final prompt, and save/download actions.

## Storage Layout

Suggested local storage structure:

| Folder | Purpose |
| --- | --- |
| storage/uploads/characters | Character or model reference images |
| storage/uploads/elements | Product or object reference images |
| storage/prompt-examples | Prompt template preview images |
| storage/generations | Generated output images |

## Installation

### 0. Prerequisites

- Git (clone repo)
- Node.js 20+ (for Next.js/Bun compatibility, but Bun can run directly)
- Bun (package manager + runtime)
  - macOS/Linux:
    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```
  - Windows: ใช้ WSL/Nix หรือที่ https://bun.sh/docs/install

### 1. Clone the project

```bash
git clone <repo-url> && cd image-generator
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

```bash
cp .env.example .env
# แก้ค่าใน .env:
# - GEMINI_API_KEY => "your-api-key"
# - DATABASE_URL => file:./data/local.db
# - NEXT_PUBLIC_APP_URL => http://localhost:3000
```

### 4. Initialize database (optional)

```bash
# ถ้ามี drizzle-kit
bun run drizzle-kit generate
bun run drizzle-kit migrate
```

### 5. Run the app

```bash
bun run next dev
```

### 6. เปิดเบราเซอร์

`http://localhost:3000`

3. Create `.env` from template and add keys:

```bash
cp .env.example .env
# edit .env to set YOUR GEMINI_API_KEY, DATABASE_URL, NEXT_PUBLIC_APP_URL
```

4. Initialize SQLite database (if using migrations):

```bash
# optional: if project has drizzle-kit config
bun run drizzle-kit generate
bun run drizzle-kit migrate
```

5. Run in development mode:

```bash
bun run next dev
```

6. Open app in browser:

```
http://localhost:3000
```

## Environment Variables

```env
# Bun / App
NODE_ENV=development

# Database
DATABASE_URL=file:./local.db

# Gemini / Google AI
GEMINI_API_KEY=

# Optional Vertex AI setup
GOOGLE_CLOUD_PROJECT=
GOOGLE_APPLICATION_CREDENTIALS=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## End-to-End Flow

```text
1. Create a prompt template.
2. Upload reference images in the generator.
3. Select a template and apply overrides if needed.
4. Save uploaded files to local storage.
5. Build the final prompt.
6. Send the request to Gemini Imagen 4.
7. Save the generated image and metadata.
8. Show the result and update dashboard statistics.
```

## Git Safety

Tracked files and secrets in `.gitignore`:

- `.env`
- `node_modules/`
- `.next/`, `out/`
- `logs`, `*.log`
- IDE folders (`.vscode/`, `.idea/`)

```

## Recommended Dependencies

```json
{
  "dependencies": {
    "next": "16.x",
    "react": "19.x",
    "react-dom": "19.x",
    "drizzle-orm": "latest",
    "@google/genai": "latest",
    "zustand": "latest",
    "react-dropzone": "latest",
    "recharts": "latest",
    "tailwindcss": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "bun-types": "latest",
    "drizzle-kit": "latest",
    "typescript": "latest"
  }
}
```

## Getting Started

```bash
# 1. Install dependencies
bun install

# 2. Generate and apply Drizzle migrations
bunx drizzle-kit generate
bunx drizzle-kit migrate

# 3. Start the development server
bun run dev
```

## Suggested Next Improvements

- Add rate limiting and retry handling for generation requests.
- Persist generation status updates with background jobs or a queue.
- Normalize prompt templates into tags or enums for better filtering.
- Add image preview, download, and regeneration history in the dashboard.
- Write API and schema tests once the implementation is in place.