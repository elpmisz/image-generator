import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const STORAGE_BASE = process.cwd();

export async function saveUpload(
  file: File,
  type: "character" | "element",
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
  const dir = join(STORAGE_BASE, "public", "storage", "uploads", type);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const filepath = join(dir, filename);
  await writeFile(filepath, buffer);

  return `/storage/uploads/${type}/${filename}`;
}

export async function saveGeneration(
  base64: string,
  mimeType: string,
): Promise<string> {
  const extension = mimeType === "image/png" ? "png" : "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
  const dir = join(STORAGE_BASE, "public", "storage", "generations");

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const filepath = join(dir, filename);
  const buffer = Buffer.from(base64, "base64");
  await writeFile(filepath, buffer);

  return `/storage/generations/${filename}`;
}

export function getPublicUrl(filepath: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (filepath.startsWith("http://") || filepath.startsWith("https://")) {
    return filepath;
  }

  let finalPath = filepath.replace(/\\/g, "/");
  if (!finalPath.startsWith("/")) {
    finalPath = `/${finalPath}`;
  }

  return `${appUrl}${finalPath}`;
}
