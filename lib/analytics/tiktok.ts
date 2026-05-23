import type { PlatformFetcher, RawCampaignMetric } from "./types";

const ADVERTISER_ID = () => (process.env.TIKTOK_ADVERTISER_ID ?? "").trim();
const ACCESS_TOKEN = () => (process.env.TIKTOK_ACCESS_TOKEN ?? "").trim();

interface TikTokRow {
  metrics: {
    campaign_id: string;
    campaign_name: string;
    impressions: string;
    clicks: string;
    spend: string;
    conversion: string;
  };
  dimensions: { stat_time_day: string; campaign_id: string };
}

interface TikTokResponse {
  code?: number;
  message?: string;
  data?: {
    list?: TikTokRow[];
    page_info?: { total_page?: number; page?: number };
  };
}

export const tiktokFetcher: PlatformFetcher = {
  platform: "tiktok",
  async fetch({ since, until }) {
    const advertiserId = ADVERTISER_ID();
    const token = ACCESS_TOKEN();
    if (!advertiserId || !token) {
      throw new Error("TIKTOK_ADVERTISER_ID or TIKTOK_ACCESS_TOKEN not set");
    }

    const results: RawCampaignMetric[] = [];
    let page = 1;
    while (true) {
      const url = new URL(
        "https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/"
      );
      url.searchParams.set("advertiser_id", advertiserId);
      url.searchParams.set("report_type", "BASIC");
      url.searchParams.set("data_level", "AUCTION_CAMPAIGN");
      url.searchParams.set("dimensions", JSON.stringify(["campaign_id", "stat_time_day"]));
      url.searchParams.set(
        "metrics",
        JSON.stringify([
          "campaign_name",
          "impressions",
          "clicks",
          "spend",
          "conversion",
        ])
      );
      url.searchParams.set("start_date", since);
      url.searchParams.set("end_date", until);
      url.searchParams.set("page", String(page));
      url.searchParams.set("page_size", "200");

      const res = await fetch(url.toString(), {
        headers: { "Access-Token": token },
      });
      const json = (await res.json()) as TikTokResponse;
      if (!res.ok || (json.code && json.code !== 0)) {
        throw new Error(json.message ?? `TikTok HTTP ${res.status}`);
      }

      const list = json.data?.list ?? [];
      for (const row of list) {
        results.push({
          platform: "tiktok",
          external_id: row.dimensions.campaign_id,
          name: row.metrics.campaign_name,
          date: row.dimensions.stat_time_day.slice(0, 10),
          impressions: Number(row.metrics.impressions ?? 0),
          clicks: Number(row.metrics.clicks ?? 0),
          spend_thb: Number(row.metrics.spend ?? 0),
          conversions: Number(row.metrics.conversion ?? 0),
          raw: row as unknown as Record<string, unknown>,
        });
      }

      const info = json.data?.page_info;
      if (!info || !info.total_page || page >= info.total_page) break;
      page += 1;
    }

    return results;
  },
};
