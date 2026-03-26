import Link from "next/link";
import { Edit2, Trash2, Wand2 } from "lucide-react";

interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  promptText: string;
  style: string;
  aspectRatio: string;
  quality: string;
  exampleImage?: string;
  createdAt: Date;
}

interface PromptCardProps {
  template: PromptTemplate;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PromptCard({ template, onEdit, onDelete }: PromptCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
      {template.exampleImage && (
        <div className="aspect-video bg-muted">
          <img
            src={template.exampleImage}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">
            {template.name}
          </h3>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {template.style}
          </span>
        </div>
        {template.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {template.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
          {template.promptText}
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/generator?template=${template.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Wand2 className="h-4 w-4" />
            <span className="text-sm font-medium">Use</span>
          </Link>
          {onEdit && (
            <button
              onClick={() => onEdit(template.id)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(template.id)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
