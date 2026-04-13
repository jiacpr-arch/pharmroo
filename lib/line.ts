import { createHmac } from "crypto";

const CHANNEL_ACCESS_TOKEN = () =>
  (process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "").trim();
const CHANNEL_SECRET = () =>
  (process.env.LINE_CHANNEL_SECRET ?? "").trim();

/**
 * Send a LINE push message to a user or group.
 */
export async function sendLineMessage(
  to: string,
  text: string
): Promise<void> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) {
    console.warn("[LINE] CHANNEL_ACCESS_TOKEN not configured, skipping");
    return;
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to,
      messages: [{ type: "text", text }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LINE push failed (${res.status}): ${body}`);
  }
}

/**
 * Verify LINE webhook signature.
 */
export function verifyLineSignature(body: string, signature: string): boolean {
  const secret = CHANNEL_SECRET();
  if (!secret) return false;

  const hash = createHmac("SHA256", secret).update(body).digest("base64");
  return hash === signature;
}

/**
 * Reply to a LINE webhook event.
 */
export async function replyLineMessage(
  replyToken: string,
  text: string
): Promise<void> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) return;

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
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
