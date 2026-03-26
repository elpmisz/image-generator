import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { promptTemplates, generations } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET() {
  console.log("[dashboard] GET start");
  try {
    console.log("[dashboard] dbPath (via env)", process.env.DATABASE_URL);
    const [totalGenerationsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(generations);

    const [totalPromptsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(promptTemplates);

    const [successfulGenerationsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(generations)
      .where(sql`${generations.status} = 'completed'`);

    const totalGenerations = totalGenerationsResult?.count || 0;
    const totalPrompts = totalPromptsResult?.count || 0;
    const successfulGenerations = successfulGenerationsResult?.count || 0;
    const successRate =
      totalGenerations > 0
        ? (successfulGenerations / totalGenerations) * 100
        : 0;

    const recentGenerations = await db
      .select()
      .from(generations)
      .orderBy(desc(generations.createdAt))
      .limit(10);

    const thirtyDaysAgoSeconds =
      Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

    const dailyUsage = await db
      .select({
        date: sql<string>`date(${generations.createdAt}, 'unixepoch')`,
        count: sql<number>`count(*)`,
      })
      .from(generations)
      .where(sql`${generations.createdAt} >= ${thirtyDaysAgoSeconds}`)
      .groupBy(sql`date(${generations.createdAt}, 'unixepoch')`)
      .orderBy(sql`date(${generations.createdAt}, 'unixepoch')`);

    return NextResponse.json({
      totalGenerations,
      totalPrompts,
      successRate: Math.round(successRate),
      recentGenerations,
      dailyUsage,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
