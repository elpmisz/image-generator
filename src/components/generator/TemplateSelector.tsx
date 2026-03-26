"use client";

import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";

interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  style: string;
  aspectRatio: string;
  exampleImage?: string;
}

interface TemplateSelectorProps {
  selectedTemplate: PromptTemplate | null;
  onTemplateSelect: (template: PromptTemplate) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/prompts");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading templates...</div>;
  }

  if (!templates.length) {
    return (
      <div className="text-center py-8 bg-muted/50 rounded-lg">
        <Wand2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">No prompt templates found</p>
        <a
          href="/prompt/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create your first template
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateSelect(template)}
          className={`
            p-4 rounded-lg border-2 text-left transition-all
            ${selectedTemplate?.id === template.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
            }
          `}
        >
          {template.exampleImage && (
            <div className="aspect-video mb-3 bg-muted rounded overflow-hidden">
              <img
                src={template.exampleImage}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
          {template.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
          )}
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              {template.style}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
              {template.aspectRatio}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
