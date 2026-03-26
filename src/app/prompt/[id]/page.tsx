"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { PromptForm } from "@/components/prompt/PromptForm";
import { useParams } from "next/navigation";

export default function EditPromptPage() {
  const params = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchTemplate();
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/prompts`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      const templates = await response.json();
      const found = templates.find((t: any) => t.id === params.id);
      
      if (!found) {
        setNotFound(true);
      } else {
        setTemplate(found);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1">
        <Header title="Edit Prompt Template" />
        <main className="p-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex-1">
        <Header title="Edit Prompt Template" />
        <main className="p-6">
          <div className="text-center text-destructive">Template not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header title="Edit Prompt Template" />
      <main className="p-6">
        <PromptForm template={template} mode="edit" />
      </main>
    </div>
  );
}
