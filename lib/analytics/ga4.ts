import type { PlatformFetcher, RawCampaignMetric } from "./types";

const PROPERTY_ID = () => (process.env.GA4_PROPERTY_ID ?? "").trim();
const ACCESS_TOKEN = () => (process.env.GA4_ACCESS_TOKEN ?? "").trim();

interface GA4Row {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
}

interface GA4Response {
  rows?: GA4Row[];
  error?: { message?: string };
}

export const ga4Fetcher: PlatformFetcher = {
  platform: "ga4",
  async fetch({ since, until }) {
    const propertyId = PROPERTY_ID();
    const token = ACCESS_TOKEN();
    if (!propertyId || !token) {
      throw new Error("GA4_PROPERTY_ID or GA4_ACCESS_TOKEN not set");
    }

    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    const body = {
      dateRanges: [{ startDate: since, endDate: until }],
      dimensions: [
        { name: "date" },
        { name: "sessionCampaignId" },
        { name: "sessionCampaignName" },
        { name: "landingPagePlusQueryString" },
      ],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "conversions" },
        { name: "advertiserAdCost" },
      ],
      limit: 10000,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as GA4Response;
    if (!res.ok || json.error) {
      throw new Error(json.error?.message ?? `GA4 HTTP ${res.status}`);
    }

    const results: RawCampaignMetric[] = [];
    for (const row of json.rows ?? []) {
      const [rawDate, campaignId, campaignName, landingUrl] = row.dimensionValues.map(
        (d) => d.value
      );
      const [sessions, , conversions, cost] = row.metricValues.map((m) =>
        Number(m.value || 0)
      );
      const date = rawDate.length === 8
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : rawDate;
      if (!campaignId || campaignId === "(not set)") continue;
      results.push({
        platform: "ga4",
        external_id: campaignId,
        name: campaignName || campaignId,
        date,
        impressions: 0,
        clicks: sessions,
        spend_thb: cost,
        conversions,
        landing_url: landingUrl,
        raw: row as unknown as Record<string, unknown>,
      });
    }
    return results;
  },
};
