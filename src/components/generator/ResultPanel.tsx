"use client";

import { Loader2, Download } from "lucide-react";

interface ResultPanelProps {
  isGenerating: boolean;
  result: { imageUrl: string; prompt: string } | null;
  error: string | null;
}

export function ResultPanel({ isGenerating, result, error }: ResultPanelProps) {
  if (isGenerating) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">
          Generating image...
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This may take a few moments
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <p className="text-destructive font-medium">Error: {error}</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div
          className="bg-muted flex items-center justify-center"
          style={{ minHeight: "360px" }}
        >
          <img
            src={result.imageUrl}
            alt="Generated image"
            className="w-full h-full object-contain"
            style={{ maxHeight: "600px" }}
          />
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Final Prompt
            </h4>
            <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
              {result.prompt}
            </p>
          </div>
          <a
            href={result.imageUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Image
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 border border-border border-dashed rounded-lg p-12 text-center">
      <p className="text-muted-foreground">
        Select a template and upload images to generate an image
      </p>
    </div>
  );
}
