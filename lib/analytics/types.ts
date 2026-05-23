export type AdPlatform = "meta" | "google" | "tiktok" | "ga4";

export interface RawCampaignMetric {
  platform: AdPlatform;
  external_id: string;
  name: string;
  date: string;
  impressions: number;
  clicks: number;
  spend_thb: number;
  conversions: number;
  landing_url?: string;
  raw?: Record<string, unknown>;
}

export interface IngestResult {
  platform: AdPlatform;
  ok: boolean;
  campaigns_seen: number;
  rows_upserted: number;
  error?: string;
}

export interface PlatformFetcher {
  platform: AdPlatform;
  fetch(opts: { since: string; until: string }): Promise<RawCampaignMetric[]>;
}
