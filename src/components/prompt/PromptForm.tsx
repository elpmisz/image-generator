"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ASPECT_RATIOS,
  QUALITY_OPTIONS,
  STYLES,
  LIGHTING_OPTIONS,
  MOOD_OPTIONS,
  ACTION_OPTIONS,
  CAMERA_OPTIONS,
  COLOR_PALETTE_OPTIONS,
} from "@/lib/utils";

interface PromptFormProps {
  template?: {
    id: string;
    name: string;
    description?: string;
    promptText: string;
    style: string;
    lighting?: string;
    mood?: string;
    action?: string;
    camera?: string;
    colorPalette?: string;
    aspectRatio: string;
    quality: string;
    negativePrompt?: string;
    exampleImage?: string;
  };
  mode?: "create" | "edit";
}

export function PromptForm({ template, mode = "create" }: PromptFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: template?.name || "",
    description: template?.description || "",
    promptText: template?.promptText || "",
    style: template?.style || "photorealistic",
    lighting: template?.lighting || "",
    mood: template?.mood || "",
    action: template?.action || "",
    camera: template?.camera || "",
    colorPalette: template?.colorPalette || "",
    aspectRatio: template?.aspectRatio || "1:1",
    quality: template?.quality || "2k",
    negativePrompt: template?.negativePrompt || "",
    exampleImage: template?.exampleImage || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        mode === "edit" && template
          ? `/api/prompts/${template.id}`
          : "/api/prompts";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save template");

      router.push("/prompt");
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Prompt Text *
        </label>
        <textarea
          value={formData.promptText}
          onChange={(e) =>
            setFormData({ ...formData, promptText: e.target.value })
          }
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Style *
          </label>
          <select
            value={formData.style}
            onChange={(e) =>
              setFormData({ ...formData, style: e.target.value })
            }
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Aspect Ratio *
          </label>
          <select
            value={formData.aspectRatio}
            onChange={(e) =>
              setFormData({ ...formData, aspectRatio: e.target.value })
            }
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option key={ratio.value} value={ratio.value}>
                {ratio.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Quality *
        </label>
        <select
          value={formData.quality}
          disabled
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed"
        >
          {QUALITY_OPTIONS.map((quality) => (
            <option key={quality.value} value={quality.value}>
              {quality.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1">
          Quality is fixed to 2K.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Lighting
          </label>
          <select
            value={formData.lighting}
            onChange={(e) =>
              setFormData({ ...formData, lighting: e.target.value })
            }
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select lighting...</option>
            {LIGHTING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Mood
          </label>
          <select
            value={formData.mood}
            onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select mood...</option>
            {MOOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Action
          </label>
          <select
            value={formData.action}
            onChange={(e) =>
              setFormData({ ...formData, action: e.target.value })
            }
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select action...</option>
            {ACTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Camera
          </label>
          <select
            value={formData.camera}
            onChange={(e) =>
              setFormData({ ...formData, camera: e.target.value })
            }
            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select camera...</option>
            {CAMERA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Color Palette
        </label>
        <select
          value={formData.colorPalette}
          onChange={(e) =>
            setFormData({ ...formData, colorPalette: e.target.value })
          }
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select color palette...</option>
          {COLOR_PALETTE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Negative Prompt
        </label>
        <textarea
          value={formData.negativePrompt}
          onChange={(e) =>
            setFormData({ ...formData, negativePrompt: e.target.value })
          }
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={2}
          placeholder="Things to avoid in the image"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Example Image URL
        </label>
        <input
          type="text"
          value={formData.exampleImage}
          onChange={(e) =>
            setFormData({ ...formData, exampleImage: e.target.value })
          }
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Template"
              : "Update Template"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
