import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, redeemCodes, leadMessagesSent } from "@/lib/db/schema";
import { eq, and, isNull, lte, notInArray, sql } from "drizzle-orm";
import { sendLeadFollowupEmail } from "@/lib/email/templates";
import { sendFbMessage } from "@/lib/facebook-messenger";
import { sendLineMessage } from "@/lib/line";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCron(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = request.nextUrl.searchParams.get("secret");
  return (
    auth === `Bearer ${process.env.CRON_SECRET}` ||
    secret === process.env.BLOG_GENERATE_SECRET
  );
}

export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: string[] = [];

  for (const day of [1, 3, 6] as const) {
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - day);
    const cutoff = cutoffDate.toISOString().replace("T", " ").slice(0, 10);

    // Leads created on the cutoff day, not yet sent, not dropped/paid
    const pendingLeads = await db
      .select()
      .from(leads)
      .where(
        and(
          sql`substr(${leads.created_at}, 1, 10) = ${cutoff}`,
          notInArray(leads.stage, ["dropped"]),
          sql`${leads.id} NOT IN (
            SELECT lead_id FROM lead_messages_sent
            WHERE day = ${day}
          )`
        )
      );

    for (const lead of pendingLeads) {
      // Find active code for this lead
      const activeCode = await db
        .select()
        .from(redeemCodes)
        .where(
          and(
            eq(redeemCodes.lead_id, lead.id),
            isNull(redeemCodes.redeemed_at),
            lte(sql`${redeemCodes.expires_at}`, "9999-12-31")
          )
        )
        .then((r) => r[0]);

      // Skip if code already expired
      if (activeCode && activeCode.expires_at < now.toISOString().replace("T", " ").slice(0, 19)) {
        continue;
      }

      const channels: ("email" | "messenger" | "line")[] = [];

      if (lead.email) {
        try {
          await sendLeadFollowupEmail(
            lead.email,
            lead.name,
            day,
            activeCode?.code,
            activeCode?.expires_at
          );
          channels.push("email");
        } catch (err) {
          console.error("[lead-followup] email failed:", err);
        }
      }

      if (lead.fb_psid) {
        try {
          const msg = `สวัสดีครับ! ${day === 6 ? "⚡ โค้ดทดลอง PharmRoo จะหมดพรุ่งนี้แล้วครับ" : "📚 อย่าลืมทดลองใช้ PharmRoo นะครับ"}${activeCode ? `\nโค้ด: ${activeCode.code}` : ""}`;
          await sendFbMessage(lead.fb_psid, msg);
          channels.push("messenger");
        } catch (err) {
          console.error("[lead-followup] FB failed:", err);
        }
      }

      if (lead.line_user_id) {
        try {
          const msg = `สวัสดีครับ! ${day === 6 ? "⚡ โค้ดทดลอง PharmRoo จะหมดพรุ่งนี้แล้วครับ" : "📚 อย่าลืมทดลองใช้ PharmRoo นะครับ"}${activeCode ? `\nโค้ด: ${activeCode.code}` : ""}`;
          await sendLineMessage(lead.line_user_id, msg);
          channels.push("line");
        } catch (err) {
          console.error("[lead-followup] LINE failed:", err);
        }
      }

      // Mark as sent
      for (const channel of channels) {
        await db
          .insert(leadMessagesSent)
          .values({ lead_id: lead.id, day, channel })
          .onConflictDoNothing();
      }

      results.push(`lead:${lead.id} day:${day} channels:${channels.join(",")}`);
    }
  }

  return NextResponse.json({ ok: true, processed: results });
}
