export interface PromptTemplate {
  promptText: string;
  style?: string;
  lighting?: string;
  mood?: string;
  action?: string;
  camera?: string;
  colorPalette?: string;
  aspectRatio?: string;
  quality?: string;
  negativePrompt?: string;
}

export interface PromptOverrides {
  lighting?: string;
  mood?: string;
  action?: string;
  camera?: string;
  colorPalette?: string;
}

export function buildPrompt(
  template: PromptTemplate,
  overrides?: PromptOverrides,
): string {
  const parts: string[] = [];

  parts.push(template.promptText);

  const style = template.style || "";
  if (style) parts.push(`Style: ${style}`);

  const lighting = overrides?.lighting || template.lighting || "";
  if (lighting) parts.push(`Lighting: ${lighting}`);

  const mood = overrides?.mood || template.mood || "";
  if (mood) parts.push(`Mood: ${mood}`);

  const action = overrides?.action || template.action || "";
  if (action) parts.push(`Action: ${action}`);

  const camera = overrides?.camera || template.camera || "";
  if (camera) parts.push(`Camera: ${camera}`);

  const colorPalette = overrides?.colorPalette || template.colorPalette || "";
  if (colorPalette) parts.push(`Color Palette: ${colorPalette}`);

  const quality = template.quality || "2k";
  parts.push(`Quality: ${quality}`);

  const aspectRatio = template.aspectRatio || "";
  if (aspectRatio) parts.push(`Aspect Ratio: ${aspectRatio}`);

  const negativePrompt = template.negativePrompt || "";
  if (negativePrompt) parts.push(`Negative: ${negativePrompt}`);

  return parts.join(". ");
}
