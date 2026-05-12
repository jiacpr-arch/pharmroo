import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const VALID_STAGES = [
  "new",
  "contacted",
  "code_issued",
  "registered",
  "redeemed",
  "paid",
  "dropped",
] as const;

type Stage = (typeof VALID_STAGES)[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = (await request.json()) as { stage: string };

  if (!VALID_STAGES.includes(body.stage as Stage)) {
    return NextResponse.json({ error: "invalid_stage" }, { status: 400 });
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const updated = await db
    .update(leads)
    .set({ stage: body.stage, updated_at: now })
    .where(eq(leads.id, id))
    .returning()
    .then((r) => r[0]);

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: updated });
}
