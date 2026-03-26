"use client";

import {
  LIGHTING_OPTIONS,
  MOOD_OPTIONS,
  ACTION_OPTIONS,
  CAMERA_OPTIONS,
  COLOR_PALETTE_OPTIONS,
} from "@/lib/utils";

interface PromptOverrides {
  lighting?: string;
  mood?: string;
  action?: string;
  camera?: string;
  colorPalette?: string;
}

interface OverridePanelProps {
  overrides: PromptOverrides;
  onOverridesChange: (overrides: PromptOverrides) => void;
}

export function OverridePanel({
  overrides,
  onOverridesChange,
}: OverridePanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Optional Overrides
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the prompt with these optional parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Lighting
          </label>
          <select
            value={overrides.lighting || ""}
            onChange={(e) =>
              onOverridesChange({ ...overrides, lighting: e.target.value })
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
            value={overrides.mood || ""}
            onChange={(e) =>
              onOverridesChange({ ...overrides, mood: e.target.value })
            }
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Action
          </label>
          <select
            value={overrides.action || ""}
            onChange={(e) =>
              onOverridesChange({ ...overrides, action: e.target.value })
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
            value={overrides.camera || ""}
            onChange={(e) =>
              onOverridesChange({ ...overrides, camera: e.target.value })
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
          value={overrides.colorPalette || ""}
          onChange={(e) =>
            onOverridesChange({ ...overrides, colorPalette: e.target.value })
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
    </div>
  );
}
