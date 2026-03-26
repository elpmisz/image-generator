"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { ImageUploader } from "@/components/generator/ImageUploader";
import { TemplateSelector } from "@/components/generator/TemplateSelector";
import { OverridePanel } from "@/components/generator/OverridePanel";
import { ResultPanel } from "@/components/generator/ResultPanel";
import { useGeneratorStore } from "@/store/generatorStore";
import { Wand2 } from "lucide-react";
import { ASPECT_RATIOS, QUALITY_OPTIONS, STYLES } from "@/lib/utils";

export default function GeneratorPage() {
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [referenceTab, setReferenceTab] = useState<"character" | "element">(
    "character",
  );

  const {
    selectedTemplate,
    characterImages,
    elementImages,
    overrides,
    isGenerating,
    result,
    error,
    setSelectedTemplate,
    setCharacterImages,
    setElementImages,
    setOverrides,
    setIsGenerating,
    setResult,
    setError,
    reset,
  } = useGeneratorStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTemplateId(params.get("template"));
  }, []);

  useEffect(() => {
    if (templateId) {
      fetchTemplate(templateId);
    }
  }, [templateId]);

  useEffect(() => {
    if (selectedTemplate) {
      applyTemplateSettings(selectedTemplate);
    }
  }, [selectedTemplate]);

  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch("/api/prompts");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const templates = await response.json();
      const found = templates.find((t: any) => t.id === id);
      if (found) {
        setSelectedTemplate(found);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      alert("Please select a template");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          promptText: promptData.promptText,
          style: promptData.style,
          aspectRatio: promptData.aspectRatio,
          quality: promptData.quality,
          characterImages,
          elementImages,
          overrides,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      setResult({
        imageUrl: data.imageUrl,
        prompt: data.prompt,
      });
    } catch (error) {
      console.error("Generation error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate image",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const [promptData, setPromptData] = useState({
    promptText: "",
    style: "photorealistic",
    aspectRatio: "1:1",
    quality: "2k",
  });

  const applyTemplateSettings = (template: any) => {
    setPromptData({
      promptText: template.promptText || "",
      style: template.style || "photorealistic",
      aspectRatio: template.aspectRatio || "1:1",
      quality: template.quality || "2k",
    });

    setOverrides({
      lighting: template.lighting || "",
      mood: template.mood || "",
      action: template.action || "",
      camera: template.camera || "",
      colorPalette: template.colorPalette || "",
    });
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    applyTemplateSettings(template);
  };

  const canGenerate =
    selectedTemplate &&
    (characterImages.length > 0 || elementImages.length > 0);

  return (
    <div className="flex-1">
      <Header title="Image Generator" />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />

            {selectedTemplate && (
              <div className="bg-card border border-border rounded-lg p-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Prompt Detail
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Edit the template prompt and generation settings before
                      creating the image.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Prompt Text
                    </label>
                    <textarea
                      value={promptData.promptText}
                      onChange={(e) =>
                        setPromptData({
                          ...promptData,
                          promptText: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Style
                      </label>
                      <select
                        value={promptData.style}
                        onChange={(e) =>
                          setPromptData({
                            ...promptData,
                            style: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {STYLES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Aspect Ratio
                      </label>
                      <select
                        value={promptData.aspectRatio}
                        onChange={(e) =>
                          setPromptData({
                            ...promptData,
                            aspectRatio: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {ASPECT_RATIOS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Quality
                    </label>
                    <select
                      value={promptData.quality}
                      onChange={(e) =>
                        setPromptData({
                          ...promptData,
                          quality: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {QUALITY_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <OverridePanel
                    overrides={overrides}
                    onOverridesChange={setOverrides}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      References
                    </h3>
                    <div className="inline-flex rounded-lg border border-border bg-background p-1">
                      <button
                        type="button"
                        onClick={() => setReferenceTab("character")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          referenceTab === "character"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Character ({characterImages.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReferenceTab("element")}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          referenceTab === "element"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Element ({elementImages.length})
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Upload character and element references separately, but the
                    generator will use both together in one final image.
                  </p>

                  {referenceTab === "character" ? (
                    <ImageUploader
                      images={characterImages}
                      onImagesChange={setCharacterImages}
                      type="character"
                      maxFiles={4}
                    />
                  ) : (
                    <ImageUploader
                      images={elementImages}
                      onImagesChange={setElementImages}
                      type="element"
                      maxFiles={4}
                    />
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Wand2 className="h-5 w-5" />
                    <span className="font-medium">
                      {isGenerating ? "Generating..." : "Generate Image"}
                    </span>
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <ResultPanel
              isGenerating={isGenerating}
              result={result}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
