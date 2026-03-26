# AI Image Generator Platform — Implementation Plan

Build the full platform as described in README.md. The project directory is currently empty (only README.md exists).

## Proposed Changes

---

### Phase 1 — Project Scaffold

#### [NEW] package.json, next.config.ts, tsconfig.json, tailwind.config.ts, postcss.config.mjs
Initialize a Next.js 16 project via `bunx create-next-app@latest` with TypeScript, Tailwind CSS, App Router, and src directory. Then install additional dependencies: `drizzle-orm`, `@google/genai`, `zustand`, `react-dropzone`, `recharts`, `zod`, and shadcn/ui components.

#### [NEW] .env.example
Copy the environment variables from the README.

---

### Phase 2 — Database Layer

#### [NEW] src/db/schema.ts
Three tables as specified in the README: `users`, `promptTemplates`, `generations`. Uses `bun:sqlite` dialect via Drizzle.

#### [NEW] src/db/client.ts
Drizzle client using `bun:sqlite`.

#### [NEW] drizzle.config.ts
Drizzle Kit config pointing to `local.db` and `src/db/migrations/`.

---

### Phase 3 — Core Libraries

#### [NEW] src/lib/gemini.ts
`generateImage()` function using `@google/genai`. Sends reference images + prompt to `imagen-4-generate-preview-06-06`. Returns `{ base64, mimeType }`.

#### [NEW] src/lib/promptBuilder.ts
`buildPrompt()` — merges template with overrides, assembles final prompt string in the order specified in the README.

#### [NEW] src/lib/storage.ts
Helper functions: `saveUpload()`, `saveGeneration()`, `getPublicUrl()`. Files saved under `storage/uploads/` and `storage/generations/`.

#### [NEW] src/lib/utils.ts
`generateId()` (cuid-style), `cn()` (class merge), shared constants.

---

### Phase 4 — API Routes

#### [NEW] src/app/api/generate/route.ts
`POST` — validates request body with Zod, loads template, builds prompt, calls Gemini, saves image, records generation in DB.

#### [NEW] src/app/api/prompts/route.ts
`GET` — list templates. `POST` — create template.

#### [NEW] src/app/api/prompts/[id]/route.ts
`PUT` — update template. `DELETE` — delete template.

#### [NEW] src/app/api/upload/route.ts
`POST` — accepts multipart form, writes file to disk, returns path.

#### [NEW] src/app/api/dashboard/route.ts
`GET` — returns totals, success rate, recent generations, daily usage.

---

### Phase 5 — Zustand Store

#### [NEW] src/store/generatorStore.ts
State: selected template, uploaded images (character + element), overrides, generation status, result. Actions: set/reset each field.

---

### Phase 6 — UI Components

#### [NEW] src/components/layout/Sidebar.tsx
Navigation links: Dashboard, Prompt Library, Generator.

#### [NEW] src/components/layout/Header.tsx
Page title bar.

#### [NEW] src/components/dashboard/MetricsGrid.tsx
Four stat cards: total generations, total prompts, success rate, monthly activity.

#### [NEW] src/components/dashboard/UsageChart.tsx
Recharts `BarChart` for 30-day daily usage.

#### [NEW] src/components/dashboard/RecentGenerations.tsx
List of recent generations with thumbnails, status badge, and timestamp.

#### [NEW] src/components/prompt/PromptCard.tsx
Grid card with preview image, name, style badge, and action buttons (edit, delete, use).

#### [NEW] src/components/prompt/PromptForm.tsx
Form for creating/editing a prompt template: name, description, prompt text, style, lighting, mood, action, camera, color palette, aspect ratio, quality, negative prompt.

#### [NEW] src/components/generator/ImageUploader.tsx
`react-dropzone` multi-image upload zone. Two instances: character refs and element refs.

#### [NEW] src/components/generator/TemplateSelector.tsx
Searchable grid of prompt template cards.

#### [NEW] src/components/generator/OverridePanel.tsx
Optional override inputs: lighting, mood, action, camera.

#### [NEW] src/components/generator/ResultPanel.tsx
Shows loading spinner, generated image, final prompt text, download button.

---

### Phase 7 — Pages

#### [NEW] src/app/layout.tsx
Root layout with sidebar + header. Dark theme.

#### [NEW] src/app/dashboard/page.tsx
Fetches `/api/dashboard`, renders MetricsGrid, UsageChart, RecentGenerations, quick action buttons.

#### [NEW] src/app/prompt/page.tsx
Fetches `/api/prompts`, renders PromptCard grid, "New Prompt" button.

#### [NEW] src/app/prompt/new/page.tsx
Renders PromptForm in create mode.

#### [NEW] src/app/prompt/[id]/page.tsx
Fetches template by id, renders PromptForm in edit mode.

#### [NEW] src/app/generator/page.tsx
Full generator workflow: ImageUploader, TemplateSelector, OverridePanel, generate button, ResultPanel.

---

### Phase 8 — Storage Directories

Create `storage/uploads/characters/`, `storage/uploads/elements/`, `storage/prompt-examples/`, `storage/generations/` with `.gitkeep` files.

---

## Verification Plan

### Automated (Dev Server)

```bash
# 1. Install and migrate
bun install
bunx drizzle-kit generate
bunx drizzle-kit migrate

# 2. Start dev server
bun run dev
```

### Manual Browser Verification

After running `bun run dev` and opening http://localhost:3000:

1. **Dashboard** — navigate to `/dashboard`. Should show 4 stat cards (all zeros initially), an empty chart, and an empty recent list.
2. **Prompt Library** — navigate to `/prompt`. Should show an empty grid with a "New Prompt" button.
3. **Create Prompt** — click "New Prompt", fill out the form, save. Should redirect back to `/prompt` and show the new card.
4. **Generator** — navigate to `/generator`. Should show the upload zones and template selector.

### API Test with curl

```bash
# List prompts (expect empty array)
curl http://localhost:3000/api/prompts

# Dashboard stats (expect zeros)
curl http://localhost:3000/api/dashboard

# Create a prompt template
curl -X POST http://localhost:3000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","promptText":"A beautiful landscape","style":"photorealistic","aspectRatio":"1:1","quality":"standard"}'
```
