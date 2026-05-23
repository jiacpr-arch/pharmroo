import { and, eq, gte, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  adCampaigns,
  adMetricsDaily,
  landingPages,
  optimizationRuns,
} from "@/lib/db/schema";
import type { LandingPage } from "@/lib/db/schema";

export interface AggregatedMetrics {
  landing_page_id: string;
  path: string;
  name: string;
  days: number;
  campaigns: number;
  impressions: number;
  clicks: number;
  ctr: number;
  spend_thb: number;
  conversions: number;
  cpa_thb: number | null;
  roas: number | null;
}

export interface DetectionFlag {
  metric: "ctr" | "cpa" | "roas" | "no_conversions";
  observed: number | null;
  threshold: number;
  severity: "warn" | "critical";
}

export interface DetectionResult {
  landing: LandingPage;
  aggregate: AggregatedMetrics;
  flags: DetectionFlag[];
  run_id?: string;
  status: "ok" | "queued" | "skipped" | "noisy";
}

const MIN_IMPRESSIONS = 1000;
const MIN_CLICKS = 50;
const MIN_SPEND_THB = 200;

export async function aggregateLast(
  landingPageId: string,
  days: number
): Promise<AggregatedMetrics | null> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  const sinceStr = since.toISOString().slice(0, 10);

  const rows = await db
    .select({
      path: landingPages.path,
      name: landingPages.name,
      impressions: sql<number>`COALESCE(SUM(${adMetricsDaily.impressions}), 0)::int`,
      clicks: sql<number>`COALESCE(SUM(${adMetricsDaily.clicks}), 0)::int`,
      spend: sql<number>`COALESCE(SUM(${adMetricsDaily.spend_thb}), 0)::float`,
      conversions: sql<number>`COALESCE(SUM(${adMetricsDaily.conversions}), 0)::int`,
      campaigns: sql<number>`COUNT(DISTINCT ${adCampaigns.id})::int`,
    })
    .from(landingPages)
    .leftJoin(adCampaigns, eq(adCampaigns.landing_page_id, landingPages.id))
    .leftJoin(
      adMetricsDaily,
      and(
        eq(adMetricsDaily.campaign_id, adCampaigns.id),
        gte(adMetricsDaily.date, sinceStr)
      )
    )
    .where(eq(landingPages.id, landingPageId))
    .groupBy(landingPages.id, landingPages.path, landingPages.name);

  if (!rows[0]) return null;
  const r = rows[0];
  const ctr = r.impressions > 0 ? r.clicks / r.impressions : 0;
  const cpa = r.conversions > 0 ? r.spend / r.conversions : null;
  const roas = null;

  return {
    landing_page_id: landingPageId,
    path: r.path,
    name: r.name,
    days,
    campaigns: r.campaigns,
    impressions: r.impressions,
    clicks: r.clicks,
    ctr,
    spend_thb: r.spend,
    conversions: r.conversions,
    cpa_thb: cpa,
    roas,
  };
}

export function evaluate(
  landing: LandingPage,
  agg: AggregatedMetrics
): DetectionFlag[] {
  const flags: DetectionFlag[] = [];

  if (agg.ctr < landing.ctr_threshold) {
    flags.push({
      metric: "ctr",
      observed: agg.ctr,
      threshold: landing.ctr_threshold,
      severity: agg.ctr < landing.ctr_threshold / 2 ? "critical" : "warn",
    });
  }

  if (agg.cpa_thb !== null && agg.cpa_thb > landing.cpa_threshold_thb) {
    flags.push({
      metric: "cpa",
      observed: agg.cpa_thb,
      threshold: landing.cpa_threshold_thb,
      severity:
        agg.cpa_thb > landing.cpa_threshold_thb * 2 ? "critical" : "warn",
    });
  }

  if (agg.roas !== null && agg.roas < landing.roas_threshold) {
    flags.push({
      metric: "roas",
      observed: agg.roas,
      threshold: landing.roas_threshold,
      severity: agg.roas < landing.roas_threshold / 2 ? "critical" : "warn",
    });
  }

  if (agg.clicks >= MIN_CLICKS && agg.conversions === 0) {
    flags.push({
      metric: "no_conversions",
      observed: 0,
      threshold: 1,
      severity: "critical",
    });
  }

  return flags;
}

export function isStatisticallyNoisy(agg: AggregatedMetrics): boolean {
  return (
    agg.impressions < MIN_IMPRESSIONS ||
    agg.clicks < MIN_CLICKS ||
    agg.spend_thb < MIN_SPEND_THB
  );
}

async function hasOpenRun(landingPageId: string): Promise<boolean> {
  const open = await db
    .select({ id: optimizationRuns.id })
    .from(optimizationRuns)
    .where(
      and(
        eq(optimizationRuns.landing_page_id, landingPageId),
        sql`${optimizationRuns.status} IN ('pending', 'proposed')`
      )
    )
    .limit(1);
  return open.length > 0;
}

async function queueRun(
  landingPageId: string,
  agg: AggregatedMetrics,
  flags: DetectionFlag[]
): Promise<string> {
  const inserted = await db
    .insert(optimizationRuns)
    .values({
      landing_page_id: landingPageId,
      trigger: "scheduled",
      status: "pending",
      reason: {
        flags,
        aggregate: agg,
        detected_at: new Date().toISOString(),
      },
    })
    .returning({ id: optimizationRuns.id });
  return inserted[0].id;
}

export async function detectAll(days = 7): Promise<DetectionResult[]> {
  const pages = await db
    .select()
    .from(landingPages)
    .where(eq(landingPages.status, "active"));

  const results: DetectionResult[] = [];

  for (const landing of pages) {
    const agg = await aggregateLast(landing.id, days);
    if (!agg) continue;

    if (isStatisticallyNoisy(agg)) {
      results.push({ landing, aggregate: agg, flags: [], status: "noisy" });
      continue;
    }

    const flags = evaluate(landing, agg);
    if (flags.length === 0) {
      results.push({ landing, aggregate: agg, flags: [], status: "ok" });
      continue;
    }

    if (await hasOpenRun(landing.id)) {
      results.push({ landing, aggregate: agg, flags, status: "skipped" });
      continue;
    }

    const runId = await queueRun(landing.id, agg, flags);
    results.push({
      landing,
      aggregate: agg,
      flags,
      run_id: runId,
      status: "queued",
    });
  }

  return results;
}

export async function listOpenRuns() {
  return db
    .select({
      id: optimizationRuns.id,
      landing_page_id: optimizationRuns.landing_page_id,
      path: landingPages.path,
      name: landingPages.name,
      status: optimizationRuns.status,
      reason: optimizationRuns.reason,
      created_at: optimizationRuns.created_at,
      auto_optimize: landingPages.auto_optimize,
    })
    .from(optimizationRuns)
    .innerJoin(landingPages, eq(landingPages.id, optimizationRuns.landing_page_id))
    .where(
      and(
        sql`${optimizationRuns.status} IN ('pending', 'proposed')`,
        isNotNull(optimizationRuns.landing_page_id)
      )
    );
}
