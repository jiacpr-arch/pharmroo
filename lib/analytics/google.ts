import type { PlatformFetcher, RawCampaignMetric } from "./types";

const CUSTOMER_ID = () => (process.env.GOOGLE_ADS_CUSTOMER_ID ?? "").trim();
const DEV_TOKEN = () => (process.env.GOOGLE_ADS_DEVELOPER_TOKEN ?? "").trim();
const ACCESS_TOKEN = () => (process.env.GOOGLE_ADS_ACCESS_TOKEN ?? "").trim();
const LOGIN_CUSTOMER_ID = () =>
  (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? "").trim();

interface GoogleAdsRow {
  campaign?: { id?: string; name?: string };
  segments?: { date?: string };
  metrics?: {
    impressions?: string;
    clicks?: string;
    costMicros?: string;
    conversions?: number;
  };
}

interface GoogleAdsResponse {
  results?: GoogleAdsRow[];
  nextPageToken?: string;
  error?: { message?: string };
}

const USD_TO_THB = 36;

export const googleFetcher: PlatformFetcher = {
  platform: "google",
  async fetch({ since, until }) {
    const customerId = CUSTOMER_ID();
    const devToken = DEV_TOKEN();
    const token = ACCESS_TOKEN();
    if (!customerId || !devToken || !token) {
      throw new Error(
        "GOOGLE_ADS_CUSTOMER_ID / DEVELOPER_TOKEN / ACCESS_TOKEN not set"
      );
    }

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE segments.date BETWEEN '${since}' AND '${until}'
        AND campaign.status = 'ENABLED'
    `;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "developer-token": devToken,
      "Content-Type": "application/json",
    };
    const loginCid = LOGIN_CUSTOMER_ID();
    if (loginCid) headers["login-customer-id"] = loginCid;

    const url = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:searchStream`;

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Google Ads HTTP ${res.status}: ${text}`);
    }
    const payload = (await res.json()) as GoogleAdsResponse | GoogleAdsResponse[];
    const batches = Array.isArray(payload) ? payload : [payload];

    const results: RawCampaignMetric[] = [];
    for (const batch of batches) {
      for (const row of batch.results ?? []) {
        const costMicros = Number(row.metrics?.costMicros ?? 0);
        const costUsd = costMicros / 1_000_000;
        results.push({
          platform: "google",
          external_id: String(row.campaign?.id ?? ""),
          name: row.campaign?.name ?? "",
          date: row.segments?.date ?? since,
          impressions: Number(row.metrics?.impressions ?? 0),
          clicks: Number(row.metrics?.clicks ?? 0),
          spend_thb: costUsd * USD_TO_THB,
          conversions: Number(row.metrics?.conversions ?? 0),
          raw: row as unknown as Record<string, unknown>,
        });
      }
    }
    return results;
  },
};
