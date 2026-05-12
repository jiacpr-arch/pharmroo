import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { generateChatbotReply } from "@/lib/chatbot";
import { getOrCreateLeadFromChannel } from "@/lib/lead-channel";
import { handleBotIntent, handleEmailCapture } from "@/lib/bot-intent";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyJiarooSignature(body: string, signature: string): boolean {
  const secret = process.env.JIAROO_LINE_CHANNEL_SECRET ?? "";
  if (!secret) return false;
  const hash = createHmac("SHA256", secret).update(body).digest("base64");
  return hash === signature;
}

async function sendJiarooReply(to: string, text: string): Promise<void> {
  const token = (process.env.JIAROO_LINE_CHANNEL_TOKEN ?? "").trim();
  if (!token) return;

  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to, messages: [{ type: "text", text }] }),
  }).catch(() => {});
}

interface LineEvent {
  type: string;
  replyToken: string;
  source: { userId: string; type: string };
  message?: { type: string; text: string };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") ?? "";

  if (!verifyJiarooSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(body) as { events: LineEvent[] };

  for (const event of payload.events) {
    const lineUserId = event.source.userId;

    if (event.type === "follow") {
      await sendJiarooReply(
        lineUserId,
        "สวัสดีครับ! 🎉 ยินดีต้อนรับ PharmRoo ถามเรื่องสอบ PLE/NLE ได้เลยครับ 💊"
      );
      continue;
    }

    if (event.type === "message" && event.message?.type === "text") {
      const text = event.message.text.trim();

      const lead = await getOrCreateLeadFromChannel({
        channel: "line_oa",
        channelUserId: lineUserId,
      });

      await handleEmailCapture(lead.id, text).catch(() => {});

      const { text: reply, intent } = await generateChatbotReply(
        text,
        "line",
        `jiaroo:${lineUserId}`,
        { leadId: lead.id }
      );

      await sendJiarooReply(lineUserId, reply);

      if (intent) {
        await handleBotIntent(lead.id, intent, "line").catch(() => {});
      }
    }
  }

  return NextResponse.json({ ok: true });
}
