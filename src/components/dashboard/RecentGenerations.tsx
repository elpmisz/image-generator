import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Generation {
  id: string;
  prompt: string;
  imageUrl?: string;
  status: string;
  createdAt: Date;
}

interface RecentGenerationsProps {
  generations: Generation[];
}

export function RecentGenerations({ generations }: RecentGenerationsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}
      >
        {status}
      </span>
    );
  };

  if (!generations.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recent Generations
        </h3>
        <p className="text-muted-foreground">No generations yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Recent Generations
      </h3>
      <div className="space-y-4">
        {generations.map((generation) => (
          <div
            key={generation.id}
            className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
          >
            {generation.imageUrl && (
              <img
                src={generation.imageUrl}
                alt="Generated"
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(generation.status)}
                {getStatusBadge(generation.status)}
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                {generation.prompt}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(generation.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
