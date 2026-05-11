import { db } from "@/lib/db";
import { leads, redeemCodes } from "@/lib/db/schema";
import { eq, and, isNull, gt } from "drizzle-orm";
import { issueRedeemCode } from "@/lib/redeem";
import { sendRedeemCodeEmail } from "@/lib/email/templates";
import { sendFbMessage } from "@/lib/facebook-messenger";
import { sendLineMessage } from "@/lib/line";

export const MAX_CODES_PER_LEAD = 3;

export function detectEmail(message: string): string | null {
  const trimmed = message.trim();
  const match = trimmed.match(/^[\w.+-]+@[\w-]+\.\w{2,}$/);
  return match ? trimmed : null;
}

export async function handleEmailCapture(
  leadId: string,
  message: string
): Promise<boolean> {
  const email = detectEmail(message);
  if (!email) return false;

  await db
    .update(leads)
    .set({ email, updated_at: new Date().toISOString().replace("T", " ").slice(0, 19) })
    .where(eq(leads.id, leadId));

  return true;
}

export async function handleBotIntent(
  leadId: string,
  intent: string,
  channel: "web" | "line" | "facebook"
): Promise<void> {
  if (intent !== "trial") return;

  const lead = await db
    .select()
    .from(leads)
    .where(eq(leads.id, leadId))
    .then((r) => r[0]);

  if (!lead) return;

  // Skip if already converted
  if (lead.stage === "redeemed" || lead.stage === "paid") return;

  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  // Check for existing active (unredeemed + not expired) code
  const activeCodes = await db
    .select()
    .from(redeemCodes)
    .where(
      and(
        eq(redeemCodes.lead_id, leadId),
        isNull(redeemCodes.redeemed_at),
        gt(redeemCodes.expires_at, now)
      )
    );

  if (activeCodes.length > 0) {
    // Resend existing active code
    await deliverCode(lead, activeCodes[0].code, activeCodes[0].expires_at, channel, false);
    return;
  }

  // Count total codes ever issued to this lead
  const allCodes = await db
    .select({ code: redeemCodes.code })
    .from(redeemCodes)
    .where(eq(redeemCodes.lead_id, leadId));

  if (allCodes.length >= MAX_CODES_PER_LEAD) return;

  // Issue new code
  const rewardType = lead.reward_choice ?? "monthly_1m";
  const { code, expiresAt } = await issueRedeemCode({
    rewardType,
    source: `bot_${channel}`,
    campaign: lead.campaign ?? undefined,
    leadId,
    issuedToEmail: lead.email ?? undefined,
  });

  // Advance stage
  await db
    .update(leads)
    .set({ stage: "code_issued", updated_at: now })
    .where(eq(leads.id, leadId));

  await deliverCode(lead, code, expiresAt, channel, allCodes.length === 0);
}

async function deliverCode(
  lead: { email: string | null; fb_psid: string | null; line_user_id: string | null },
  code: string,
  expiresAt: string,
  channel: "web" | "line" | "facebook",
  isFirst: boolean
) {
  const intro = isFirst
    ? `🎁 พี่มีโค้ดทดลองรายเดือนฟรีให้น้องเลยครับ`
    : `พี่ออกโค้ดใหม่ให้น้องเลยครับ`;

  const msg = `${intro}\n\nโค้ด: ${code}\nหมดอายุ: ${expiresAt.slice(0, 10)}\n\nใช้ได้ที่ https://pharmroo.com/pricing — กรอกโค้ดตอน checkout นะครับ 💊`;

  if (channel === "facebook" && lead.fb_psid) {
    await sendFbMessage(lead.fb_psid, msg);
  } else if (channel === "line" && lead.line_user_id) {
    await sendLineMessage(lead.line_user_id, [{ type: "text", text: msg }]);
  }

  if (lead.email) {
    await sendRedeemCodeEmail(lead.email, code, expiresAt, isFirst).catch(
      () => {}
    );
  }
}
