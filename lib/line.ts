import { createHmac } from "crypto";

const CHANNEL_ACCESS_TOKEN = () =>
  (process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "").trim();
const CHANNEL_SECRET = () =>
  (process.env.LINE_CHANNEL_SECRET ?? "").trim();

export type LineMessage =
  | { type: "text"; text: string }
  | { type: "flex"; altText: string; contents: object };

/**
 * Send LINE push message(s) to a user or group.
 * Accepts either a plain string (converted to text message) or an array of message objects.
 */
export async function sendLineMessage(
  to: string,
  messages: string | LineMessage[]
): Promise<void> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) {
    console.warn("[LINE] CHANNEL_ACCESS_TOKEN not configured, skipping");
    return;
  }

  const lineMessages: LineMessage[] =
    typeof messages === "string"
      ? [{ type: "text", text: messages }]
      : messages;

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, messages: lineMessages }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LINE push failed (${res.status}): ${body}`);
  }
}

/**
 * Broadcast LINE messages to all followers.
 */
export async function broadcastLineMessages(
  messages: LineMessage[]
): Promise<void> {
  const token = CHANNEL_ACCESS_TOKEN();
  if (!token) return;

  const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LINE broadcast failed (${res.status}): ${body}`);
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
