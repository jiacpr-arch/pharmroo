import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { issueRedeemCode } from "@/lib/redeem";
import { sendRedeemCodeEmail } from "@/lib/email/templates";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const lead = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id))
    .then((r) => r[0]);

  if (!lead) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    rewardType?: string;
  };

  const { code, expiresAt } = await issueRedeemCode({
    rewardType: body.rewardType ?? lead.reward_choice ?? "monthly_1m",
    source: "admin",
    leadId: lead.id,
    issuedToEmail: lead.email ?? undefined,
  });

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  await db
    .update(leads)
    .set({ stage: "code_issued", updated_at: now })
    .where(eq(leads.id, id));

  if (lead.email) {
    sendRedeemCodeEmail(lead.email, code, expiresAt, false).catch(() => {});
  }

  return NextResponse.json({ ok: true, code, expiresAt });
}
