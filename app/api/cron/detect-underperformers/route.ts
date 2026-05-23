import { NextResponse } from "next/server";
import { detectAll } from "@/lib/analytics/detect";

export const maxDuration = 120;

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
  const daysParam = url.searchParams.get("days");
  const days = daysParam ? Math.max(1, Math.min(30, Number(daysParam))) : 7;

  const results = await detectAll(days);

  const summary = {
    total: results.length,
    queued: results.filter((r) => r.status === "queued").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    noisy: results.filter((r) => r.status === "noisy").length,
    ok: results.filter((r) => r.status === "ok").length,
  };

  return NextResponse.json({
    window_days: days,
    summary,
    results: results.map((r) => ({
      path: r.landing.path,
      status: r.status,
      run_id: r.run_id,
      flags: r.flags.map((f) => ({
        metric: f.metric,
        observed: f.observed,
        threshold: f.threshold,
        severity: f.severity,
      })),
      aggregate: {
        impressions: r.aggregate.impressions,
        clicks: r.aggregate.clicks,
        ctr: r.aggregate.ctr,
        spend_thb: r.aggregate.spend_thb,
        conversions: r.aggregate.conversions,
        cpa_thb: r.aggregate.cpa_thb,
      },
    })),
  });
}

export const GET = handler;
export const POST = handler;
