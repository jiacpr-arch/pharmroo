import { NextResponse } from "next/server";
import { processPendingRuns } from "@/lib/analytics/propose";

export const maxDuration = 300;

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
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.max(1, Math.min(20, Number(limitParam))) : 5;

  const results = await processPendingRuns(limit);

  return NextResponse.json({
    processed: results.length,
    by_status: {
      applied: results.filter((r) => r.status === "applied").length,
      proposed: results.filter((r) => r.status === "proposed").length,
      rejected: results.filter((r) => r.status === "rejected").length,
      failed: results.filter((r) => r.status === "failed").length,
    },
    results,
  });
}

export const GET = handler;
export const POST = handler;
