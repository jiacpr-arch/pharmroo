import { NextResponse } from "next/server";
import { defaultDateRange, ingestPlatform } from "@/lib/analytics/ingest";
import type { AdPlatform } from "@/lib/analytics/types";

export const maxDuration = 300;

const ALL_PLATFORMS: AdPlatform[] = ["meta", "google", "tiktok", "ga4"];

async function handler(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const sinceParam = url.searchParams.get("since");
  const untilParam = url.searchParams.get("until");
  const platformsParam = url.searchParams.get("platforms");

  const range =
    sinceParam && untilParam
      ? { since: sinceParam, until: untilParam }
      : defaultDateRange(3);

  const platforms: AdPlatform[] = platformsParam
    ? (platformsParam.split(",").filter((p) =>
        (ALL_PLATFORMS as string[]).includes(p)
      ) as AdPlatform[])
    : ALL_PLATFORMS;

  const results = await Promise.all(platforms.map((p) => ingestPlatform(p, range)));

  return NextResponse.json({
    range,
    results,
  });
}

export const GET = handler;
export const POST = handler;
