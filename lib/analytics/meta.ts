import type { PlatformFetcher, RawCampaignMetric } from "./types";

const GRAPH_VERSION = "v19.0";

const AD_ACCOUNT_ID = () => (process.env.META_AD_ACCOUNT_ID ?? "").trim();
const ACCESS_TOKEN = () => (process.env.META_ADS_ACCESS_TOKEN ?? "").trim();

interface InsightsRow {
  campaign_id: string;
  campaign_name: string;
  date_start: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
}

interface InsightsResponse {
  data?: InsightsRow[];
  paging?: { next?: string };
  error?: { message: string };
}

function sumActions(actions: InsightsRow["actions"], types: string[]): number {
  if (!actions) return 0;
  return actions
    .filter((a) => types.includes(a.action_type))
    .reduce((sum, a) => sum + Number(a.value || 0), 0);
}

export const metaFetcher: PlatformFetcher = {
  platform: "meta",
  async fetch({ since, until }) {
    const accountId = AD_ACCOUNT_ID();
    const token = ACCESS_TOKEN();
    if (!accountId || !token) {
      throw new Error("META_AD_ACCOUNT_ID or META_ADS_ACCESS_TOKEN not set");
    }

    const results: RawCampaignMetric[] = [];
    const url = new URL(
      `https://graph.facebook.com/${GRAPH_VERSION}/act_${accountId}/insights`
    );
    url.searchParams.set("level", "campaign");
    url.searchParams.set("time_increment", "1");
    url.searchParams.set("time_range", JSON.stringify({ since, until }));
    url.searchParams.set(
      "fields",
      "campaign_id,campaign_name,impressions,clicks,spend,actions,action_values"
    );
    url.searchParams.set("limit", "200");
    url.searchParams.set("access_token", token);

    let nextUrl: string | undefined = url.toString();
    while (nextUrl) {
      const res = await fetch(nextUrl);
      const json = (await res.json()) as InsightsResponse;
      if (!res.ok || json.error) {
        throw new Error(json.error?.message ?? `Meta insights HTTP ${res.status}`);
      }

      for (const row of json.data ?? []) {
        results.push({
          platform: "meta",
          external_id: row.campaign_id,
          name: row.campaign_name,
          date: row.date_start,
          impressions: Number(row.impressions ?? 0),
          clicks: Number(row.clicks ?? 0),
          spend_thb: Number(row.spend ?? 0),
          conversions: sumActions(row.actions, [
            "complete_registration",
            "lead",
            "purchase",
            "offsite_conversion.fb_pixel_complete_registration",
            "offsite_conversion.fb_pixel_lead",
            "offsite_conversion.fb_pixel_purchase",
          ]),
          raw: row as unknown as Record<string, unknown>,
        });
      }

      nextUrl = json.paging?.next;
    }

    return results;
  },
};
