import { NextResponse } from "next/server";
import { evaluateActiveVariants } from "@/lib/analytics/rollback";

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

  const results = await evaluateActiveVariants();

  return NextResponse.json({
    total: results.length,
    by_decision: {
      kept: results.filter((r) => r.decision === "kept").length,
      rolled_back: results.filter((r) => r.decision === "rolled_back").length,
      promoted: results.filter((r) => r.decision === "promoted").length,
      too_early: results.filter((r) => r.decision === "too_early").length,
      no_data: results.filter((r) => r.decision === "no_data").length,
    },
    results,
  });
}

export const GET = handler;
export const POST = handler;
