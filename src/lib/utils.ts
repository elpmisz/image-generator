import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export const ASPECT_RATIOS = [
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" },
  { label: "4:3", value: "4:3" },
  { label: "3:4", value: "3:4" },
  { label: "21:9", value: "21:9" },
];

export const QUALITY_OPTIONS = [{ label: "2K", value: "2k" }];

export const STYLES = [
  { label: "Photorealistic", value: "photorealistic" },
  { label: "Digital Art", value: "digital-art" },
  { label: "Anime", value: "anime" },
  { label: "Oil Painting", value: "oil-painting" },
  { label: "Watercolor", value: "watercolor" },
  { label: "3D Render", value: "3d-render" },
  { label: "Sketch", value: "sketch" },
  { label: "Minimalist", value: "minimalist" },
];

export const LIGHTING_OPTIONS = [
  { label: "Natural", value: "natural" },
  { label: "Studio", value: "studio" },
  { label: "Neon", value: "neon" },
  { label: "Golden Hour", value: "golden-hour" },
  { label: "Blue Hour", value: "blue-hour" },
  { label: "Dramatic", value: "dramatic" },
  { label: "Soft", value: "soft" },
  { label: "Hard", value: "hard" },
  { label: "Backlit", value: "backlit" },
  { label: "Candlelight", value: "candlelight" },
  { label: "Moonlight", value: "moonlight" },
  { label: "Rim Lighting", value: "rim-lighting" },
];

export const MOOD_OPTIONS = [
  { label: "Peaceful", value: "peaceful" },
  { label: "Dramatic", value: "dramatic" },
  { label: "Mysterious", value: "mysterious" },
  { label: "Energetic", value: "energetic" },
  { label: "Nostalgic", value: "nostalgic" },
  { label: "Romantic", value: "romantic" },
  { label: "Dark", value: "dark" },
  { label: "Bright", value: "bright" },
  { label: "Serene", value: "serene" },
  { label: "Epic", value: "epic" },
  { label: "Melancholic", value: "melancholic" },
  { label: "Whimsical", value: "whimsical" },
];

export const ACTION_OPTIONS = [
  { label: "Static", value: "static" },
  { label: "Walking", value: "walking" },
  { label: "Running", value: "running" },
  { label: "Jumping", value: "jumping" },
  { label: "Sitting", value: "sitting" },
  { label: "Standing", value: "standing" },
  { label: "Looking at Camera", value: "looking-at-camera" },
  { label: "Looking Away", value: "looking-away" },
  { label: "Battle Pose", value: "battle-pose" },
  { label: "Dancing", value: "dancing" },
  { label: "Flying", value: "flying" },
  { label: "Swimming", value: "swimming" },
];

export const CAMERA_OPTIONS = [
  { label: "Portrait", value: "portrait" },
  { label: "Landscape", value: "landscape" },
  { label: "Wide Angle", value: "wide-angle" },
  { label: "Macro", value: "macro" },
  { label: "Telephoto", value: "telephoto" },
  { label: "Fish Eye", value: "fish-eye" },
  { label: "Medium Shot", value: "medium-shot" },
  { label: "Close Up", value: "close-up" },
  { label: "Bird's Eye", value: "birds-eye" },
  { label: "Low Angle", value: "low-angle" },
  { label: "High Angle", value: "high-angle" },
  { label: "Dutch Angle", value: "dutch-angle" },
];

export const COLOR_PALETTE_OPTIONS = [
  { label: "Blue, Pink, Purple", value: "blue,pink,purple" },
  { label: "Gold, Blue, Green", value: "gold,blue,green" },
  { label: "Pink, White, Blue", value: "pink,white,blue" },
  { label: "White, Silver, Blue Accent", value: "white,silver,blue-accent" },
  { label: "Brown, Gold, Dark Red", value: "brown,gold,dark-red" },
  { label: "Neon Blue, Magenta, Cyan", value: "neon-blue,magenta,cyan" },
  { label: "Purple, Orange, Blue, Green", value: "purple,orange,blue,green" },
  { label: "Silver, Red, Gold", value: "silver,red,gold" },
  { label: "Black, White, Gray", value: "black,white,gray" },
  { label: "Red, Orange, Yellow", value: "red,orange,yellow" },
  { label: "Green, Teal, Cyan", value: "green,teal,cyan" },
  { label: "Warm Earth Tones", value: "warm-earth-tones" },
];
