import { db } from "@/lib/db";
import { leads, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { grantLineBonus, lineBonusMessage, LINE_BONUS_DAYS } from "@/lib/line-bonus";
import type { BotIntent } from "@/lib/chatbot";

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pharmru.com").trim();
}

/**
 * ตาข่ายรองรับเจตนา "อยากลอง/อยากสมัคร" แบบกำหนดตายตัว — ไม่ได้แทนที่ marker
 * ของโมเดล แต่เป็นชั้นล่างจับคำที่บอกเจตนาเชิงพาณิชย์ชัดเจน การยิงซ้ำปลอดภัย
 * เพราะ handleBotIntent อาศัย grantLineBonus ที่ idempotent อยู่แล้ว
 *
 * ตั้งใจไม่จับคำว่า "ลอง" เดี่ยว ๆ เพราะชนกับคำถามทางคลินิกบ่อย
 */
const TRIAL_INTENT_PATTERNS: RegExp[] = [
  /ทดลอง/,
  /สมัคร/,
  /ราคา|กี่บาท|เท่าไหร่|เท่าไร/,
  /แพ็?กเกจ|แพคเกจ|ค่าสมาชิก|รายเดือน|รายปี/,
  /(อยาก|ขอ|จะ|ช่วย)\s*ลอง/,
  /ลองใช้|ลองเล่น/,
  /สนใจ/,
];

export function detectTrialIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  if (detectEmail(text)) return false;
  return TRIAL_INTENT_PATTERNS.some((re) => re.test(text));
}

/** Only treats the message as an email when the WHOLE thing is one. */
export function detectEmail(message: string): string | null {
  const trimmed = message.trim();
  if (/^[\w.+%-]+@[\w.-]+\.[a-z]{2,}$/i.test(trimmed)) return trimmed.toLowerCase();
  return null;
}

/**
 * If the user sent a bare email address, persist it on their lead row and
 * return a brief acknowledgement. Returns null if not an email.
 */
export async function handleEmailCapture(leadId: string | null, message: string): Promise<string | null> {
  const email = detectEmail(message);
  if (!email || !leadId) return null;

  try {
    await db
      .update(leads)
      .set({ email, updated_at: new Date().toISOString() })
      .where(eq(leads.id, leadId));
  } catch (err) {
    console.error("[bot-intent] email capture failed:", err);
    return null;
  }

  return "บันทึกอีเมลแล้วนะครับ 📧 จะส่งข้อมูลและโปรโมชั่นให้น้องทางอีเมลด้วยครับ!";
}

/**
 * When the AI signals [INTENT:trial] — or the fallback regex layer catches
 * it — grant the existing "add LINE OA" premium bonus (lib/line-bonus.ts) to
 * whichever pharmroo account this LINE userId is linked to, if eligible.
 * There's no separate redeem-code system here; this reuses the same bonus
 * new members already get, which is already idempotent and windowed.
 */
export async function handleBotIntent(
  lineUserId: string,
  leadId: string | null,
  intent: BotIntent
): Promise<string | null> {
  if (intent !== "trial") return null;

  const user = await db
    .select({ id: users.id, membership_type: users.membership_type })
    .from(users)
    .where(eq(users.line_user_id, lineUserId))
    .then((rows) => rows[0]);

  if (!user) {
    return [
      "ตอนนี้น้องยังไม่ได้สมัครหรือเชื่อมต่อบัญชี PharmRoo กับ LINE เลยครับ",
      "",
      `สมัครฟรีและเชื่อมต่อ LINE ได้เลย รับ Premium ฟรี ${LINE_BONUS_DAYS} วันทันที 🎁`,
      `${siteUrl()}/register`,
    ].join("\n");
  }

  const bonusExpiresAt = await grantLineBonus(user.id);
  if (leadId) {
    db.update(leads)
      .set({ user_id: user.id, stage: bonusExpiresAt ? "trial_granted" : "interested", updated_at: new Date().toISOString() })
      .where(eq(leads.id, leadId))
      .catch((err) => console.error("[bot-intent] lead stage update failed:", err));
  }

  if (bonusExpiresAt) {
    return `พี่ปลดล็อก Premium ให้แล้วครับ! 🎉\n\n${lineBonusMessage(bonusExpiresAt)}`;
  }

  return [
    "น้องได้รับสิทธิ์ทดลองไปแล้ว หรือไม่ได้อยู่ในเงื่อนไขสมาชิกใหม่นะครับ 😅",
    "",
    `ดูแพ็กเกจรายเดือน/รายปีได้ที่ ${siteUrl()}/pricing`,
  ].join("\n");
}
