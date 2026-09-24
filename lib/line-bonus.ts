import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";

/** Free premium days granted once to a new member who adds the LINE OA. */
export const LINE_BONUS_DAYS = 7;

/** Only accounts created within this many days count as "new members". */
export const LINE_BONUS_NEW_MEMBER_WINDOW_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * users.created_at is stored as 'YYYY-MM-DD HH24:MI:SS' (DB server time,
 * UTC on our Postgres) — parse it as UTC.
 */
function parseCreatedAt(createdAt: string): Date {
  return new Date(createdAt.replace(" ", "T") + "Z");
}

export function isNewMember(createdAt: string, now: Date = new Date()): boolean {
  const created = parseCreatedAt(createdAt);
  if (Number.isNaN(created.getTime())) return false;
  return now.getTime() - created.getTime() <= LINE_BONUS_NEW_MEMBER_WINDOW_DAYS * DAY_MS;
}

/**
 * New expiry after adding the bonus: extends an active membership, otherwise
 * starts from now (same rule as referral reward days).
 */
export function computeBonusExpiry(
  currentExpiresAt: string | null,
  now: Date = new Date()
): Date {
  const current = currentExpiresAt ? new Date(currentExpiresAt) : null;
  const base = current && current > now ? current : now;
  return new Date(base.getTime() + LINE_BONUS_DAYS * DAY_MS);
}

/**
 * Grant the one-time "add LINE" premium bonus. Returns the new expiry when
 * granted, or null when the user isn't eligible (not a new member, or already
 * received it). The update is guarded on line_bonus_granted_at IS NULL so a
 * duplicate webhook delivery can't grant twice.
 */
export async function grantLineBonus(userId: string): Promise<Date | null> {
  const user = await db
    .select({
      membership_type: users.membership_type,
      membership_expires_at: users.membership_expires_at,
      line_bonus_granted_at: users.line_bonus_granted_at,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => rows[0]);

  if (!user || user.line_bonus_granted_at || !isNewMember(user.created_at)) {
    return null;
  }

  const now = new Date();
  const expiresAt = computeBonusExpiry(user.membership_expires_at, now);

  const updated = await db
    .update(users)
    .set({
      // Keep yearly/monthly as-is; free members become monthly for the bonus.
      membership_type: user.membership_type === "free" ? "monthly" : user.membership_type,
      membership_expires_at: expiresAt.toISOString(),
      line_bonus_granted_at: now.toISOString(),
    })
    .where(and(eq(users.id, userId), isNull(users.line_bonus_granted_at)))
    .returning({ id: users.id });

  return updated.length > 0 ? expiresAt : null;
}

export function lineBonusMessage(expiresAt: Date): string {
  const date = expiresAt.toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `🎁 ของขวัญสมาชิกใหม่!\nรับ Premium ฟรี ${LINE_BONUS_DAYS} วัน\nใช้งานได้ถึง ${date}\n\n(ออกจากระบบแล้วเข้าใหม่ 1 ครั้งเพื่อเริ่มใช้งาน)`;
}
