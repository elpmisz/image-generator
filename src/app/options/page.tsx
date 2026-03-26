"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface OptionSet {
  name: string;
  options: { label: string; value: string }[];
}

const DEFAULT_OPTIONS: OptionSet[] = [
  {
    name: "lighting",
    options: [
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
    ],
  },
  {
    name: "mood",
    options: [
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
    ],
  },
  {
    name: "action",
    options: [
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
    ],
  },
  {
    name: "camera",
    options: [
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
    ],
  },
  {
    name: "colorPalette",
    options: [
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
    ],
  },
];

export default function OptionsPage() {
  const [optionSets, setOptionSets] = useState<OptionSet[]>(DEFAULT_OPTIONS);
  const [activeTab, setActiveTab] = useState("lighting");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");

  const activeOptions = optionSets.find((set) => set.name === activeTab)?.options || [];

  const handleAdd = () => {
    if (!newLabel || !newValue) return;

    setOptionSets((prev) =>
      prev.map((set) =>
        set.name === activeTab
          ? { ...set, options: [...set.options, { label: newLabel, value: newValue }] }
          : set
      )
    );

    setNewLabel("");
    setNewValue("");
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const option = activeOptions[index];
    setNewLabel(option.label);
    setNewValue(option.value);
  };

  const handleSave = (index: number) => {
    if (!newLabel || !newValue) return;

    setOptionSets((prev) =>
      prev.map((set) =>
        set.name === activeTab
          ? {
              ...set,
              options: set.options.map((opt, i) =>
                i === index ? { label: newLabel, value: newValue } : opt
              ),
            }
          : set
      )
    );

    setEditingIndex(null);
    setNewLabel("");
    setNewValue("");
  };

  const handleDelete = (index: number) => {
    if (!confirm("Are you sure you want to delete this option?")) return;

    setOptionSets((prev) =>
      prev.map((set) =>
        set.name === activeTab
          ? { ...set, options: set.options.filter((_, i) => i !== index) }
          : set
      )
    );
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewLabel("");
    setNewValue("");
  };

  const handleSaveAll = () => {
    localStorage.setItem("promptOptions", JSON.stringify(optionSets));
    alert("Options saved successfully!");
  };

  useEffect(() => {
    const saved = localStorage.getItem("promptOptions");
    if (saved) {
      try {
        setOptionSets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved options");
      }
    }
  }, []);

  return (
    <div className="flex-1">
      <Header title="Options Management" />
      <main className="p-6 space-y-6">
        <div className="flex gap-4 border-b border-border">
          {optionSets.map((set) => (
            <button
              key={set.name}
              onClick={() => setActiveTab(set.name)}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === set.name
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {set.name.charAt(0).toUpperCase() + set.name.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Label
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Option label"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Option value"
              />
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="bg-muted/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    Label
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    Value
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeOptions.map((option, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="px-4 py-3">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          className="w-full px-2 py-1 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <span className="text-foreground">{option.label}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          className="w-full px-2 py-1 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                          {option.value}
                        </code>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingIndex === index ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSave(index)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-sm"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors text-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Save All Options
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
