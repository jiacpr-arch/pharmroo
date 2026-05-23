import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { landingPages, optimizationRuns, pageVariants } from "@/lib/db/schema";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role !== "admin") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runs = await db
    .select({
      id: optimizationRuns.id,
      status: optimizationRuns.status,
      trigger: optimizationRuns.trigger,
      reason: optimizationRuns.reason,
      proposal: optimizationRuns.proposal,
      applied_variant_id: optimizationRuns.applied_variant_id,
      error: optimizationRuns.error,
      created_at: optimizationRuns.created_at,
      completed_at: optimizationRuns.completed_at,
      landing_id: landingPages.id,
      landing_path: landingPages.path,
      landing_name: landingPages.name,
      auto_optimize: landingPages.auto_optimize,
    })
    .from(optimizationRuns)
    .innerJoin(landingPages, eq(landingPages.id, optimizationRuns.landing_page_id))
    .orderBy(desc(optimizationRuns.created_at))
    .limit(100);

  return NextResponse.json({ runs });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    run_id?: string;
    action?: "approve" | "reject" | "rollback";
    traffic_pct?: number;
  };

  if (!body.run_id || !body.action) {
    return NextResponse.json({ error: "run_id and action required" }, { status: 400 });
  }

  const runs = await db
    .select({
      id: optimizationRuns.id,
      status: optimizationRuns.status,
      proposal: optimizationRuns.proposal,
      landing_page_id: optimizationRuns.landing_page_id,
      applied_variant_id: optimizationRuns.applied_variant_id,
    })
    .from(optimizationRuns)
    .where(eq(optimizationRuns.id, body.run_id))
    .limit(1);

  const run = runs[0];
  if (!run) return NextResponse.json({ error: "run not found" }, { status: 404 });

  const nowStr = sql`to_char(now(), 'YYYY-MM-DD HH24:MI:SS')` as unknown as string;

  if (body.action === "reject") {
    await db
      .update(optimizationRuns)
      .set({ status: "rejected", completed_at: nowStr })
      .where(eq(optimizationRuns.id, run.id));
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  if (body.action === "approve") {
    if (run.status !== "proposed") {
      return NextResponse.json(
        { error: `cannot approve a ${run.status} run` },
        { status: 400 }
      );
    }
    const trafficPct = Math.max(1, Math.min(100, body.traffic_pct ?? 50));
    const variantInsert = await db
      .insert(pageVariants)
      .values({
        landing_page_id: run.landing_page_id,
        name: `manual-${new Date().toISOString().slice(0, 10)}`,
        patch: run.proposal as unknown as object,
        traffic_pct: trafficPct,
        is_active: true,
        is_baseline: false,
        created_by: "human",
      })
      .returning({ id: pageVariants.id });

    await db
      .update(optimizationRuns)
      .set({
        status: "applied",
        applied_variant_id: variantInsert[0].id,
        completed_at: nowStr,
      })
      .where(eq(optimizationRuns.id, run.id));

    return NextResponse.json({ ok: true, status: "applied", variant_id: variantInsert[0].id });
  }

  if (body.action === "rollback") {
    if (!run.applied_variant_id) {
      return NextResponse.json({ error: "no applied variant to rollback" }, { status: 400 });
    }
    await db
      .update(pageVariants)
      .set({ is_active: false, traffic_pct: 0 })
      .where(eq(pageVariants.id, run.applied_variant_id));
    await db
      .update(optimizationRuns)
      .set({ status: "rolled_back", completed_at: nowStr })
      .where(eq(optimizationRuns.id, run.id));
    return NextResponse.json({ ok: true, status: "rolled_back" });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
