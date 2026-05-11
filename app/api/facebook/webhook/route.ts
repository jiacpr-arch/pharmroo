import { NextRequest, NextResponse } from "next/server";
import { verifyFbSignature, sendFbMessage, sendFbTyping, sendFbReadReceipt } from "@/lib/facebook-messenger";
import { generateChatbotReply } from "@/lib/chatbot";
import { getOrCreateLeadFromChannel } from "@/lib/lead-channel";
import { handleBotIntent, handleEmailCapture } from "@/lib/bot-intent";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 60;

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

async function checkRateLimit(psid: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_WINDOW_MS)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.channel, "facebook"),
        eq(chatMessages.channel_user_id, psid),
        eq(chatMessages.role, "user"),
        gte(chatMessages.created_at, windowStart)
      )
    )
    .then((r) => r[0]?.count ?? 0);

  return count < RATE_LIMIT;
}

// Meta verify handshake
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    return new Response(challenge ?? "ok", { status: 200 });
  }

  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

// Messenger webhook
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256") ?? "";

  if (!verifyFbSignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  // Always 200 after signature check
  processWebhook(rawBody).catch((err) =>
    console.error("[facebook/webhook]", err)
  );

  return NextResponse.json({ ok: true });
}

async function processWebhook(rawBody: string) {
  const payload = JSON.parse(rawBody) as {
    object: string;
    entry: Array<{
      messaging: Array<{
        sender: { id: string };
        message?: { text: string };
        postback?: { payload: string };
      }>;
    }>;
  };

  if (payload.object !== "page") return;

  for (const entry of payload.entry) {
    for (const event of entry.messaging ?? []) {
      const psid = event.sender.id;
      const text = event.message?.text;

      if (!text) continue;
      if (!(await checkRateLimit(psid))) continue;

      await sendFbReadReceipt(psid);
      await sendFbTyping(psid, true);

      const lead = await getOrCreateLeadFromChannel({
        channel: "fb_messenger",
        channelUserId: psid,
      });

      await handleEmailCapture(lead.id, text).catch(() => {});

      const { text: reply, intent } = await generateChatbotReply(
        text,
        "facebook",
        psid,
        { leadId: lead.id }
      );

      await sendFbTyping(psid, false);
      await sendFbMessage(psid, reply);

      if (intent) {
        await handleBotIntent(lead.id, intent, "facebook").catch(() => {});
      }
    }
  }
}
