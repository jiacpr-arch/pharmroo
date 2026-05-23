import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { adCampaigns, adMetricsDaily, landingPages } from "@/lib/db/schema";
import { metaFetcher } from "./meta";
import { googleFetcher } from "./google";
import { tiktokFetcher } from "./tiktok";
import { ga4Fetcher } from "./ga4";
import type { AdPlatform, IngestResult, PlatformFetcher, RawCampaignMetric } from "./types";

export const FETCHERS: Record<AdPlatform, PlatformFetcher> = {
  meta: metaFetcher,
  google: googleFetcher,
  tiktok: tiktokFetcher,
  ga4: ga4Fetcher,
};

function pathFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url, "https://placeholder.local");
    return u.pathname || "/";
  } catch {
    return url.startsWith("/") ? url.split("?")[0] : null;
  }
}

async function resolveLandingPageId(
  rawUrl: string | undefined,
  cache: Map<string, string | null>
): Promise<string | null> {
  const path = pathFromUrl(rawUrl);
  if (!path) return null;
  if (cache.has(path)) return cache.get(path) ?? null;

  const found = await db
    .select({ id: landingPages.id })
    .from(landingPages)
    .where(eq(landingPages.path, path))
    .limit(1);

  const id = found[0]?.id ?? null;
  cache.set(path, id);
  return id;
}

async function upsertCampaign(
  platform: AdPlatform,
  externalId: string,
  name: string,
  landingPageId: string | null
): Promise<string> {
  const existing = await db
    .select({ id: adCampaigns.id, landing_page_id: adCampaigns.landing_page_id })
    .from(adCampaigns)
    .where(and(eq(adCampaigns.platform, platform), eq(adCampaigns.external_id, externalId)))
    .limit(1);

  const nowStr = sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')`;

  if (existing[0]) {
    await db
      .update(adCampaigns)
      .set({
        name,
        last_synced_at: sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string,
        ...(landingPageId && !existing[0].landing_page_id
          ? { landing_page_id: landingPageId }
          : {}),
      })
      .where(eq(adCampaigns.id, existing[0].id));
    return existing[0].id;
  }

  const inserted = await db
    .insert(adCampaigns)
    .values({
      platform,
      external_id: externalId,
      name,
      landing_page_id: landingPageId,
      last_synced_at: nowStr as unknown as string,
    })
    .returning({ id: adCampaigns.id });

  return inserted[0].id;
}

async function upsertMetric(campaignId: string, row: RawCampaignMetric) {
  const ctr = row.impressions > 0 ? row.clicks / row.impressions : 0;
  const cpa = row.conversions > 0 ? row.spend_thb / row.conversions : null;
  // ROAS requires revenue — leave null until we wire conversion value.
  const roas = null;

  await db
    .insert(adMetricsDaily)
    .values({
      campaign_id: campaignId,
      date: row.date,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr,
      spend_thb: row.spend_thb,
      conversions: row.conversions,
      cpa_thb: cpa,
      roas,
      raw: row.raw ?? {},
    })
    .onConflictDoUpdate({
      target: [adMetricsDaily.campaign_id, adMetricsDaily.date],
      set: {
        impressions: row.impressions,
        clicks: row.clicks,
        ctr,
        spend_thb: row.spend_thb,
        conversions: row.conversions,
        cpa_thb: cpa,
        roas,
        raw: row.raw ?? {},
        ingested_at: sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string,
      },
    });
}

export async function ingestPlatform(
  platform: AdPlatform,
  range: { since: string; until: string }
): Promise<IngestResult> {
  const fetcher = FETCHERS[platform];
  try {
    const rows = await fetcher.fetch(range);
    const cache = new Map<string, string | null>();
    const seenCampaigns = new Set<string>();

    for (const row of rows) {
      const landingId = await resolveLandingPageId(row.landing_url, cache);
      const cid = await upsertCampaign(platform, row.external_id, row.name, landingId);
      seenCampaigns.add(cid);
      await upsertMetric(cid, row);
    }

    return {
      platform,
      ok: true,
      campaigns_seen: seenCampaigns.size,
      rows_upserted: rows.length,
    };
  } catch (err) {
    return {
      platform,
      ok: false,
      campaigns_seen: 0,
      rows_upserted: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function defaultDateRange(daysBack = 3): { since: string; until: string } {
  const today = new Date();
  const until = today.toISOString().slice(0, 10);
  const sinceDate = new Date(today);
  sinceDate.setUTCDate(sinceDate.getUTCDate() - daysBack);
  const since = sinceDate.toISOString().slice(0, 10);
  return { since, until };
}
