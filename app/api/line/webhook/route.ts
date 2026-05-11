import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyLineMessage, sendLineMessage } from "@/lib/line";
import { db } from "@/lib/db";
import { lineLinkCodes, users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { generateChatbotReply } from "@/lib/chatbot";
import { getOrCreateLeadFromChannel } from "@/lib/lead-channel";
import { handleBotIntent, handleEmailCapture } from "@/lib/bot-intent";
import { buildChatbotCard, type CardType } from "@/lib/line-flex-templates";

export const runtime = "nodejs";
export const maxDuration = 60;

interface LineEvent {
  type: string;
  replyToken: string;
  source: { userId: string; type: string };
  message?: { type: string; text: string };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") ?? "";

  if (!verifyLineSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(body) as { events: LineEvent[] };

  for (const event of payload.events) {
    const lineUserId = event.source.userId;

    if (event.type === "follow") {
      await replyLineMessage(
        event.replyToken,
        "สวัสดีครับ! 🎉\nยินดีต้อนรับสู่ PharmRoo\n\nถามอะไรเกี่ยวกับการเตรียมสอบ PLE หรือ NLE ได้เลยครับ 💊"
      );
      // Create embryo lead for new follower
      await getOrCreateLeadFromChannel({
        channel: "line_oa",
        channelUserId: lineUserId,
      }).catch(() => {});
    } else if (event.type === "message" && event.message?.type === "text") {
      const text = event.message.text.trim();

      // Account link code
      if (text.startsWith("PHARMROO-")) {
        await handleLinkCode(event.replyToken, text, lineUserId);
        continue;
      }

      // Bot reply
      const lead = await getOrCreateLeadFromChannel({
        channel: "line_oa",
        channelUserId: lineUserId,
      });

      await handleEmailCapture(lead.id, text).catch(() => {});

      const { text: reply, intent, card } = await generateChatbotReply(
        text,
        "line",
        lineUserId,
        { leadId: lead.id }
      );

      if (card) {
        const cardType = card as CardType;
        const flexMsg = buildChatbotCard(cardType);
        await sendLineMessage(lineUserId, [
          { type: "text", text: reply },
          flexMsg,
        ]).catch(() => {});
      } else {
        await replyLineMessage(event.replyToken, reply);
      }

      if (intent) {
        await handleBotIntent(lead.id, intent, "line").catch(() => {});
      }
    }
  }

  return NextResponse.json({ ok: true });
}

async function handleLinkCode(
  replyToken: string,
  code: string,
  lineUserId: string
) {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  const linkCode = await db
    .select()
    .from(lineLinkCodes)
    .where(and(eq(lineLinkCodes.code, code), gt(lineLinkCodes.expires_at, now)))
    .then((rows) => rows[0]);

  if (linkCode) {
    await db
      .update(users)
      .set({ line_user_id: lineUserId, line_linked_at: now })
      .where(eq(users.id, linkCode.user_id));

    await db.delete(lineLinkCodes).where(eq(lineLinkCodes.id, linkCode.id));

    await replyLineMessage(
      replyToken,
      "✅ เชื่อมต่อบัญชีสำเร็จ!\nคุณจะได้รับแจ้งเตือนผ่าน LINE แล้วครับ"
    );
  } else {
    await replyLineMessage(
      replyToken,
      "❌ รหัสไม่ถูกต้องหรือหมดอายุแล้วครับ\nกรุณาสร้างรหัสใหม่จากหน้า Profile"
    );
  }
}
