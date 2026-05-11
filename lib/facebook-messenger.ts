import { createHmac, timingSafeEqual } from "crypto";

const GRAPH_API = "https://graph.facebook.com/v24.0";

function pageToken(): string {
  return process.env.FACEBOOK_PAGE_TOKEN ?? "";
}

export async function sendFbMessage(psid: string, text: string): Promise<void> {
  const token = pageToken();
  if (!token) {
    console.warn("[FB Messenger] FACEBOOK_PAGE_TOKEN not configured");
    return;
  }

  const res = await fetch(`${GRAPH_API}/me/messages?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: psid },
      message: { text },
      messaging_type: "RESPONSE",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[FB Messenger] sendMessage failed (${res.status}): ${body}`);
  }
}

export async function sendFbTyping(
  psid: string,
  on: boolean
): Promise<void> {
  const token = pageToken();
  if (!token) return;

  await fetch(`${GRAPH_API}/me/messages?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: psid },
      sender_action: on ? "typing_on" : "typing_off",
    }),
  }).catch(() => {});
}

export async function sendFbReadReceipt(psid: string): Promise<void> {
  const token = pageToken();
  if (!token) return;

  await fetch(`${GRAPH_API}/me/messages?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: psid },
      sender_action: "mark_seen",
    }),
  }).catch(() => {});
}

export function verifyFbSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const secret = process.env.FACEBOOK_APP_SECRET;
  if (!secret) return false;

  const [algo, hex] = signatureHeader.split("=");
  if (algo !== "sha256" || !hex) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(hex, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
