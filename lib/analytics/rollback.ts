import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adCampaigns,
  adMetricsDaily,
  landingPages,
  optimizationRuns,
  pageVariants,
} from "@/lib/db/schema";
import { aggregateLast, evaluate } from "./detect";

const MIN_DAYS_LIVE = 3;
const MAX_DAYS_LIVE = 14;
const MIN_CLICKS_FOR_VERDICT = 100;

export interface RollbackResult {
  variant_id: string;
  landing_path: string;
  decision: "kept" | "rolled_back" | "promoted" | "too_early" | "no_data";
  reason?: string;
  days_live: number;
}

function daysBetween(isoLike: string): number {
  const d = new Date(isoLike.replace(" ", "T") + "Z");
  return (Date.now() - d.getTime()) / 86_400_000;
}

async function metricsForVariant(
  landingPageId: string,
  sinceDate: string
): Promise<{ clicks: number; conversions: number; ctr: number; cpa: number | null }> {
  const rows = await db
    .select({
      impressions: sql<number>`COALESCE(SUM(${adMetricsDaily.impressions}), 0)::int`,
      clicks: sql<number>`COALESCE(SUM(${adMetricsDaily.clicks}), 0)::int`,
      spend: sql<number>`COALESCE(SUM(${adMetricsDaily.spend_thb}), 0)::float`,
      conversions: sql<number>`COALESCE(SUM(${adMetricsDaily.conversions}), 0)::int`,
    })
    .from(adCampaigns)
    .leftJoin(
      adMetricsDaily,
      and(
        eq(adMetricsDaily.campaign_id, adCampaigns.id),
        gte(adMetricsDaily.date, sinceDate)
      )
    )
    .where(eq(adCampaigns.landing_page_id, landingPageId));

  const r = rows[0] ?? { impressions: 0, clicks: 0, spend: 0, conversions: 0 };
  const ctr = r.impressions > 0 ? r.clicks / r.impressions : 0;
  const cpa = r.conversions > 0 ? r.spend / r.conversions : null;
  return { clicks: r.clicks, conversions: r.conversions, ctr, cpa };
}

export async function evaluateActiveVariants(): Promise<RollbackResult[]> {
  const variants = await db
    .select({
      id: pageVariants.id,
      landing_page_id: pageVariants.landing_page_id,
      traffic_pct: pageVariants.traffic_pct,
      created_at: pageVariants.created_at,
      path: landingPages.path,
      landing: landingPages,
    })
    .from(pageVariants)
    .innerJoin(landingPages, eq(landingPages.id, pageVariants.landing_page_id))
    .where(eq(pageVariants.is_active, true));

  const out: RollbackResult[] = [];

  for (const v of variants) {
    const daysLive = daysBetween(v.created_at);

    if (daysLive < MIN_DAYS_LIVE) {
      out.push({
        variant_id: v.id,
        landing_path: v.path,
        decision: "too_early",
        days_live: daysLive,
      });
      continue;
    }

    const sinceDate = v.created_at.slice(0, 10);
    const live = await metricsForVariant(v.landing_page_id, sinceDate);

    if (live.clicks < MIN_CLICKS_FOR_VERDICT && daysLive < MAX_DAYS_LIVE) {
      out.push({
        variant_id: v.id,
        landing_path: v.path,
        decision: "no_data",
        days_live: daysLive,
        reason: `only ${live.clicks} clicks since deploy`,
      });
      continue;
    }

    const agg = await aggregateLast(v.landing_page_id, Math.max(MIN_DAYS_LIVE, Math.floor(daysLive)));
    if (!agg) {
      out.push({
        variant_id: v.id,
        landing_path: v.path,
        decision: "no_data",
        days_live: daysLive,
      });
      continue;
    }

    const flags = evaluate(v.landing, agg);
    const criticalRemaining = flags.some((f) => f.severity === "critical");

    if (criticalRemaining || (daysLive >= MAX_DAYS_LIVE && flags.length > 0)) {
      await db
        .update(pageVariants)
        .set({ is_active: false, traffic_pct: 0, metrics_summary: { live, flags } })
        .where(eq(pageVariants.id, v.id));

      await db
        .update(optimizationRuns)
        .set({
          status: "rolled_back",
          error: criticalRemaining
            ? "critical flags still present after deploy"
            : "no improvement within max window",
          completed_at: sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string,
        })
        .where(
          and(
            eq(optimizationRuns.applied_variant_id, v.id),
            eq(optimizationRuns.status, "applied")
          )
        );

      out.push({
        variant_id: v.id,
        landing_path: v.path,
        decision: "rolled_back",
        days_live: daysLive,
        reason: criticalRemaining ? "critical_remaining" : "no_improvement",
      });
      continue;
    }

    if (flags.length === 0 && v.traffic_pct < 100) {
      await db
        .update(pageVariants)
        .set({ traffic_pct: Math.min(100, v.traffic_pct + 25), metrics_summary: { live, flags } })
        .where(eq(pageVariants.id, v.id));
      out.push({
        variant_id: v.id,
        landing_path: v.path,
        decision: "promoted",
        days_live: daysLive,
        reason: `traffic ${v.traffic_pct} -> ${Math.min(100, v.traffic_pct + 25)}`,
      });
      continue;
    }

    out.push({
      variant_id: v.id,
      landing_path: v.path,
      decision: "kept",
      days_live: daysLive,
    });
  }

  return out;
}
