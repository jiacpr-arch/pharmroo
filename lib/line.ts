import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { appSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getResend, fromEmail } from "@/lib/email/resend";

const CHANNEL_ACCESS_TOKEN = () =>
  (process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "").trim();
const CHANNEL_SECRET = () => (process.env.LINE_CHANNEL_SECRET ?? "").trim();

type LineTextMessage = { type: "text"; text: string };
export type LineFlexMessage = {
  type: "flex";
  altText: string;
  contents: Record<string, unknown>;
};
export type LineMessage = LineTextMessage | LineFlexMessage;

function toMessages(input: string | LineMessage[]): LineMessage[] {
  return typeof input === "string" ? [{ type: "text", text: input }] : input;
}

// ─── Quota awareness ───────────────────────────────────────────────────────
//
// A cron that loops over many LINE-linked users (expiry warnings, weekly
// summary, broadcasts) can burn through the monthly free-tier message quota
// in one run. Two defenses:
//
//  1. Proactive: bulk-sending routes call checkLineQuota() once before the
//     loop and skip the run when headroom is low, preserving quota for
//     low-volume/high-value sends (payment confirmations, webhook replies)
//     that call sendLineMessage()/replyLineMessage() directly.
//  2. Reactive: if a send still comes back 429 with a quota-exceeded body,
//     the admin gets emailed (at most once/day).

const LINE_QUOTA_CACHE_KEY = "line_quota_cache";
const LINE_QUOTA_ALERT_KEY = "line_quota_alert_sent_at";
const QUOTA_CACHE_TTL_MS = 15 * 60_000;
const ALERT_DEDUPE_MS = 24 * 60 * 60_000;

/**
 * Reserve kept off-limits to bulk sends, so critical single-recipient sends
 * still get through: 5% of the quota, but at least LINE_QUOTA_RESERVE_MIN —
 * capped at LINE_QUOTA_RESERVE_MAX_FRACTION of the quota so a small plan
 * (the free OA plan's ~300/month) isn't reserved in full and every bulk
 * send permanently throttled.
 */
export const LINE_QUOTA_RESERVE_MIN = 300;
export const LINE_QUOTA_RESERVE_FRACTION = 0.05;
export const LINE_QUOTA_RESERVE_MAX_FRACTION = 0.2;

export function lineQuotaReserve(limit: number): number {
  const floor = Math.min(LINE_QUOTA_RESERVE_MIN, Math.ceil(limit * LINE_QUOTA_RESERVE_MAX_FRACTION));
  return Math.max(floor, Math.ceil(limit * LINE_QUOTA_RESERVE_FRACTION));
}

export interface LineQuotaStatus {
  /** null when the plan is unlimited ("none") or unknown — never throttles. */
  limit: number | null;
  used: number | null;
  remaining: number | null;
  /** true when bulk sends should back off and leave headroom for critical sends. */
  throttled: boolean;
}

/** Pure so the threshold math is unit-testable without hitting the LINE API. */
export function computeLineQuotaStatus(
  limit: number | null,
  used: number | null
): LineQuotaStatus {
  if (limit == null || used == null) {
    return { limit, used, remaining: null, throttled: false };
  }
  const remaining = limit - used;
  return { limit, used, remaining, throttled: remaining <= lineQuotaReserve(limit) };
}

let inFlightQuotaCheck: Promise<LineQuotaStatus> | null = null;
let quotaAlertedThisInvocation = false;

async function fetchLineQuotaFromLine(
  token: string
): Promise<{ limit: number | null; used: number | null }> {
  const headers = { Authorization: `Bearer ${token}` };
  const [quotaRes, consumptionRes] = await Promise.all([
    fetch("https://api.line.me/v2/bot/message/quota", { headers }),
    fetch("https://api.line.me/v2/bot/message/quota/consumption", { headers }),
  ]);

  if (!quotaRes.ok) {
    console.error(`[line] quota check failed status=${quotaRes.status}`);
    return { limit: null, used: null };
  }

  const quota = (await quotaRes.json().catch(() => null)) as {
    type?: string;
    value?: number;
  } | null;
  if (!quota || quota.type !== "limited" || typeof quota.value !== "number") {
    return { limit: null, used: null };
  }

  const consumption = consumptionRes.ok
    ? ((await consumptionRes.json().catch(() => null)) as {
        totalUsage?: number;
      } | null)
    : null;

  return { limit: quota.value, used: consumption?.totalUsage ?? null };
}

/**
 * Cached quota check for bulk-sending routes to call before they start a
 * send loop. Cheap to call repeatedly — only hits the LINE API once per
 * QUOTA_CACHE_TTL_MS across the whole app (cache lives in app_settings).
 */
export async function checkLineQuota(): Promise<LineQuotaStatus> {
  if (inFlightQuotaCheck) return inFlightQuotaCheck;

  inFlightQuotaCheck = (async () => {
    const token = CHANNEL_ACCESS_TOKEN();
    if (!token) return computeLineQuotaStatus(null, null);

    try {
      const cached = await db
        .select({ value: appSettings.value, updated_at: appSettings.updated_at })
        .from(appSettings)
        .where(eq(appSettings.key, LINE_QUOTA_CACHE_KEY))
        .then((rows) => rows[0]);

      const cachedAt = cached?.updated_at ? new Date(cached.updated_at).getTime() : 0;
      const isFresh = Date.now() - cachedAt < QUOTA_CACHE_TTL_MS;

      let limit: number | null = null;
      let used: number | null = null;

      if (isFresh && cached?.value) {
        try {
          const parsed = JSON.parse(cached.value) as {
            limit: number | null;
            used: number | null;
          };
          limit = parsed.limit;
          used = parsed.used;
        } catch {
          // fall through to a fresh fetch below
        }
      }

      if (!isFresh) {
        const fresh = await fetchLineQuotaFromLine(token);
        limit = fresh.limit;
        used = fresh.used;
        await db
          .insert(appSettings)
          .values({
            key: LINE_QUOTA_CACHE_KEY,
            value: JSON.stringify({ limit, used }),
            updated_at: new Date().toISOString(),
          })
          .onConflictDoUpdate({
            target: appSettings.key,
            set: {
              value: JSON.stringify({ limit, used }),
              updated_at: new Date().toISOString(),
            },
          });
      }

      const status = computeLineQuotaStatus(limit, used);
      if (status.throttled) {
        await notifyAdminLineQuotaLow(status);
      }
      return status;
    } catch (err) {
      console.error("[line] checkLineQuota failed:", err);
      return computeLineQuotaStatus(null, null);
    }
  })();

  try {
    return await inFlightQuotaCheck;
  } finally {
    inFlightQuotaCheck = null;
  }
}

function looksLikeQuotaExceeded(status: number, body: string): boolean {
  return status === 429 && /monthly limit|quota/i.test(body);
}

/** Reactive safety net: called when a send actually 429s with a quota-shaped body. */
async function flagQuotaExceededFromSend(context: string, body: string): Promise<void> {
  if (quotaAlertedThisInvocation) return;
  quotaAlertedThisInvocation = true;
  await notifyAdminLineQuotaLow(null, `${context}: ${body.slice(0, 300)}`);
}

async function notifyAdminLineQuotaLow(
  status: LineQuotaStatus | null,
  detail?: string
): Promise<void> {
  try {
    const lastAlert = await db
      .select({ value: appSettings.value })
      .from(appSettings)
      .where(eq(appSettings.key, LINE_QUOTA_ALERT_KEY))
      .then((rows) => rows[0]?.value);
    if (lastAlert && Date.now() - new Date(lastAlert).getTime() < ALERT_DEDUPE_MS) {
      return; // already alerted recently — don't spam
    }
    await db
      .insert(appSettings)
      .values({
        key: LINE_QUOTA_ALERT_KEY,
        value: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { value: new Date().toISOString(), updated_at: new Date().toISOString() },
      });
  } catch (err) {
    console.error("[line] quota-alert dedupe check failed:", err);
    // Keep going — better to risk one extra alert than to drop it entirely.
  }

  const remainingLine =
    status?.remaining != null ? `เหลือ ${status.remaining}/${status.limit} ข้อความ` : "";
  const subject = "🚨 LINE OA โควตาข้อความใกล้หมด/เต็มแล้ว";
  const html = [
    "<p>ระบบตรวจพบว่า LINE Official Account ใกล้หมดโควตาข้อความรายเดือน หรือส่งไม่ได้แล้ว</p>",
    remainingLine ? `<p>${remainingLine}</p>` : "",
    detail ? `<p>รายละเอียด: ${detail}</p>` : "",
    "<p>ผลกระทบ: cron ที่ส่งจำนวนมาก (เตือนหมดอายุ, สรุปรายสัปดาห์ ฯลฯ) จะถูกข้ามอัตโนมัติเพื่อกันโควตาไว้ให้ข้อความสำคัญ เช่น ยืนยันชำระเงิน</p>",
    "<p>แนะนำ: ตรวจสอบที่ LINE Official Account Manager &gt; การตั้งค่า &gt; สถิติการส่งข้อความ หรืออัปเกรดแพ็กเกจ</p>",
  ]
    .filter(Boolean)
    .join("\n");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    try {
      await getResend().emails.send({
        from: fromEmail,
        to: adminEmail.split(",").map((e) => e.trim()),
        subject,
        html,
      });
    } catch (err) {
      console.error("[line] quota admin alert email failed:", err);
    }
  }
}

// ─── Sending ────────────────────────────────────────────────────────────────

/**
 * Send a LINE push message to a user or group. Accepts a plain string
 * (backwards-compatible with existing callers) or a LineMessage[] for Flex
 * messages. Returns false instead of throwing so callers that don't wrap
 * every send in try/catch still degrade gracefully.
 */
export async function sendLineMessage(
  to: string,
  message: string | LineMessage[]
): Promise<boolean> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) {
    console.warn("[LINE] CHANNEL_ACCESS_TOKEN not configured, skipping");
    return false;
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, messages: toMessages(message) }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "<no body>");
    console.error(`[LINE] push failed (${res.status}): ${body}`);
    if (looksLikeQuotaExceeded(res.status, body)) {
      await flagQuotaExceededFromSend("sendLineMessage push", body);
    }
  }

  return res.ok;
}

/**
 * Reply to a LINE webhook event — free, unlike push/broadcast, so answering
 * the event that triggered the reply this way keeps quota for sends nothing
 * triggered. A reply token is single-use and expires quickly, so this can
 * legitimately fail; callers should fall back to sendLineMessage(), which
 * replyOrPushLineMessage() below does automatically.
 */
export async function replyLineMessage(
  replyToken: string,
  message: string | LineMessage[]
): Promise<boolean> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) return false;

  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ replyToken, messages: toMessages(message) }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "<no body>");
    console.warn(`[LINE] reply failed (${res.status}): ${body}`);
  }

  return res.ok;
}

/**
 * Reply when possible, push when not — the default way webhook handlers
 * should answer the event that triggered them.
 */
export async function replyOrPushLineMessage(
  lineUserId: string,
  replyToken: string | undefined,
  message: string | LineMessage[]
): Promise<boolean> {
  if (replyToken) {
    const replied = await replyLineMessage(replyToken, message);
    if (replied) return true;
  }
  return sendLineMessage(lineUserId, message);
}

export async function broadcastLineMessages(
  message: string | LineMessage[]
): Promise<{ ok: boolean; error?: string }> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) return { ok: false, error: "LINE_CHANNEL_ACCESS_TOKEN not set" };

  const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages: toMessages(message) }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "<no body>");
    if (looksLikeQuotaExceeded(res.status, err)) {
      await flagQuotaExceededFromSend("broadcastLineMessages", err);
    }
    return { ok: false, error: err };
  }
  return { ok: true };
}

/**
 * Verify LINE webhook signature (timing-safe).
 */
export function verifyLineSignature(body: string, signature: string): boolean {
  const secret = CHANNEL_SECRET();
  if (!secret) return false;

  const expected = createHmac("SHA256", secret).update(body).digest();

  let received: Buffer;
  try {
    received = Buffer.from(signature, "base64");
  } catch {
    return false;
  }

  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}

/**
 * Get LINE user profile.
 */
export async function getLineProfile(
  userId: string
): Promise<{ displayName: string; pictureUrl?: string } | null> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) return null;

  const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json() as Promise<{
    displayName: string;
    pictureUrl?: string;
  }>;
}

/**
 * Whether the LINE Login user has added the OA linked to the Login channel as
 * a friend. Uses the user's LINE Login access token (needs `profile` scope).
 * Returns false on any error so sign-in is never blocked by it.
 */
export async function isLineOaFriend(loginAccessToken: string): Promise<boolean> {
  try {
    const res = await fetch("https://api.line.me/friendship/v1/status", {
      headers: { Authorization: `Bearer ${loginAccessToken}` },
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { friendFlag?: boolean };
    return data.friendFlag === true;
  } catch {
    return false;
  }
}
