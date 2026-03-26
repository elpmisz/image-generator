"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { RecentGenerations } from "@/components/dashboard/RecentGenerations";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1">
        <Header title="Dashboard" />
        <main className="p-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </main>
      </div>
    );
  }

  const monthlyActivity = data?.recentGenerations?.filter(
    (gen: any) => new Date(gen.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length || 0;

  return (
    <div className="flex-1">
      <Header title="Dashboard" />
      <main className="p-6 space-y-6">
        <div className="flex gap-4">
          <Link
            href="/prompt/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Prompt Template</span>
          </Link>
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <span>Generate Image</span>
          </Link>
        </div>

        <MetricsGrid
          totalGenerations={data?.totalGenerations || 0}
          totalPrompts={data?.totalPrompts || 0}
          successRate={data?.successRate || 0}
          monthlyActivity={monthlyActivity}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UsageChart data={data?.dailyUsage || []} />
          <RecentGenerations generations={data?.recentGenerations || []} />
        </div>
      </main>
    </div>
  );
}
