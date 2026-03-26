interface MetricsGridProps {
  totalGenerations: number;
  totalPrompts: number;
  successRate: number;
  monthlyActivity: number;
}

export function MetricsGrid({
  totalGenerations,
  totalPrompts,
  successRate,
  monthlyActivity,
}: MetricsGridProps) {
  const metrics = [
    { label: "Total Generations", value: totalGenerations, color: "text-blue-500" },
    { label: "Total Prompts", value: totalPrompts, color: "text-green-500" },
    { label: "Success Rate", value: `${successRate}%`, color: "text-purple-500" },
    { label: "Monthly Activity", value: monthlyActivity, color: "text-orange-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-card border border-border rounded-lg p-6"
        >
          <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
          <p className={`text-3xl font-bold ${metric.color}`}>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
