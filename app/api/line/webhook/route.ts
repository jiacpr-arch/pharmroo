import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyOrPushLineMessage, replyLineMessage, type LineMessage } from "@/lib/line";
import { LINE_BONUS_DAYS, grantLineBonus, lineBonusMessage } from "@/lib/line-bonus";
import { buildChatbotCard, buildFollowGreetingFlex } from "@/lib/line-flex-templates";
import { buildNonTextGreeting, isNonTextMessage } from "@/lib/line-greeting";
import { handleDailyMcqPostback } from "@/lib/daily-mcq-line";
import { generateChatbotReply, trimHistory, type ChatMessage as ChatbotMessage } from "@/lib/chatbot";
import { detectTrialIntent, handleBotIntent, handleEmailCapture } from "@/lib/bot-intent";
import { getOrCreateLeadFromLine } from "@/lib/lead-channel";
import { db } from "@/lib/db";
import { chatMessages, lineLinkCodes, lineUnfollowEvents, users } from "@/lib/db/schema";
import { eq, and, gt, gte, ne } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pharmru.com";

/** Per-LINE-user cap on chatbot turns, to keep AI spend and spam under control. */
const CHATBOT_RATE_LIMIT_PER_HOUR = 30;

export const runtime = "nodejs";

interface LineEvent {
  type: string;
  replyToken?: string;
  source: { userId: string; type: string };
  message?: { type: string; text?: string };
  postback?: { data: string };
}

/**
 * LINE OA Webhook — handles follow/unfollow events + link code messages.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-line-signature") ?? "";

  if (!verifyLineSignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(body) as { events: LineEvent[] };

  for (const event of payload.events) {
    if (event.type === "follow") {
      await handleFollow(event);
    } else if (event.type === "unfollow") {
      await handleUnfollow(event);
    } else if (event.type === "postback") {
      await handlePostback(event);
    } else if (event.type === "message" && event.message?.type === "text") {
      await handleTextMessage(event);
    } else if (event.type === "message" && isNonTextMessage(event.message?.type)) {
      if (event.replyToken) {
        await replyLineMessage(event.replyToken, buildNonTextGreeting());
      }
    }
  }

  return NextResponse.json({ ok: true });
}

async function handleFollow(event: LineEvent) {
  // Accounts created via LINE login already carry this LINE userId, so
  // following the OA is enough to claim the new-member bonus.
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.line_user_id, event.source.userId))
    .then((rows) => rows[0]);
  const bonusExpiresAt = existing ? await grantLineBonus(existing.id) : null;

  if (!event.replyToken) return;
  await replyLineMessage(event.replyToken, [
    buildFollowGreetingFlex(
      bonusExpiresAt
        ? lineBonusMessage(bonusExpiresAt)
        : existing
          ? `ทำข้อสอบต่อ 👉 ${SITE_URL}/ple`
          : `🎁 สมาชิกใหม่รับ Premium ฟรี ${LINE_BONUS_DAYS} วัน!\nกด "เข้าสู่ระบบด้วย LINE" ที่ ${SITE_URL}/login ระบบจะเปิดสิทธิ์ให้อัตโนมัติ\n\nสมัครด้วยอีเมลไว้แล้ว? ส่งรหัสเชื่อมต่อจากหน้า Profile ในแชทนี้`
    ),
  ]);
}

async function handleUnfollow(event: LineEvent) {
  await db.insert(lineUnfollowEvents).values({
    line_user_id: event.source.userId,
  });
}

async function handlePostback(event: LineEvent) {
  const data = event.postback?.data;
  if (!data) return;

  const params = new URLSearchParams(data);
  if (params.get("action") !== "daily_answer") return; // reserved for future postback actions

  const date = params.get("d");
  const label = params.get("a");
  if (!date || !label) return;

  const lineUserId = event.source.userId;
  const user = await db
    .select({ id: users.id, exam_category: users.exam_category })
    .from(users)
    .where(eq(users.line_user_id, lineUserId))
    .then((rows) => rows[0]);

  const category = user?.exam_category ?? (params.get("c") === "nursing" ? "nursing" : "pharmacy");
  const isHard = params.get("h") === "1";

  const result = await handleDailyMcqPostback({
    lineUserId,
    userId: user?.id ?? null,
    date,
    category,
    selectedLabel: label,
    isHard,
  });

  await replyOrPushLineMessage(lineUserId, event.replyToken, [result]);
}

async function handleTextMessage(event: LineEvent) {
  const text = event.message?.text?.trim() ?? "";
  if (!text) return;

  if (!text.startsWith("PHARMROO-")) {
    await handleChatbotMessage(event, text);
    return;
  }

  // Link code attempt
  const lineUserId = event.source.userId;
  const now = new Date().toISOString();

  const linkCode = await db
    .select()
    .from(lineLinkCodes)
    .where(and(eq(lineLinkCodes.code, text), gt(lineLinkCodes.expires_at, now)))
    .then((rows) => rows[0]);

  if (!linkCode) {
    if (event.replyToken) {
      await replyLineMessage(
        event.replyToken,
        "❌ รหัสไม่ถูกต้องหรือหมดอายุ\nกรุณาสร้างรหัสใหม่จากหน้า Profile"
      );
    }
    return;
  }

  // users.line_user_id is unique: linking a LINE already bound to another
  // account would fail, and would let one LINE claim the bonus repeatedly.
  const linkedElsewhere = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.line_user_id, lineUserId), ne(users.id, linkCode.user_id)))
    .then((rows) => rows[0]);
  if (linkedElsewhere) {
    if (event.replyToken) {
      await replyLineMessage(
        event.replyToken,
        "⚠️ LINE นี้เชื่อมต่อกับบัญชีฟาร์มรู้อื่นอยู่แล้ว\nหากต้องการความช่วยเหลือ พิมพ์บอกแอดมินในแชทนี้ได้เลย"
      );
    }
    return;
  }

  // Link the account
  await db
    .update(users)
    .set({ line_user_id: lineUserId, line_linked_at: now })
    .where(eq(users.id, linkCode.user_id));

  // Delete used code
  await db.delete(lineLinkCodes).where(eq(lineLinkCodes.id, linkCode.id));

  const bonusExpiresAt = await grantLineBonus(linkCode.user_id);

  if (event.replyToken) {
    await replyLineMessage(
      event.replyToken,
      bonusExpiresAt
        ? `✅ เชื่อมต่อบัญชีสำเร็จ!\nคุณจะได้รับแจ้งเตือนผ่าน LINE แล้ว\n\n${lineBonusMessage(bonusExpiresAt)}`
        : "✅ เชื่อมต่อบัญชีสำเร็จ!\nคุณจะได้รับแจ้งเตือนผ่าน LINE แล้ว"
    );
  }
}

async function handleChatbotMessage(event: LineEvent, text: string) {
  const lineUserId = event.source.userId;

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const recentCount = await db
    .select({ id: chatMessages.id })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.channel_user_id, lineUserId),
        eq(chatMessages.role, "user"),
        gte(chatMessages.created_at, oneHourAgo)
      )
    )
    .then((rows) => rows.length);

  if (recentCount >= CHATBOT_RATE_LIMIT_PER_HOUR) {
    if (event.replyToken) {
      await replyLineMessage(event.replyToken, "ถามครบจำนวนต่อชั่วโมงแล้วนะครับ ลองใหม่อีกครั้งภายหลังครับ 🙏");
    }
    return;
  }

  const leadId = await getOrCreateLeadFromLine(lineUserId);

  // A bare email address is data capture, not a question — handle it and stop.
  const emailAck = await handleEmailCapture(leadId, text);
  if (emailAck) {
    await db.insert(chatMessages).values({ channel_user_id: lineUserId, lead_id: leadId, role: "user", content: text });
    await db.insert(chatMessages).values({ channel_user_id: lineUserId, lead_id: leadId, role: "assistant", content: emailAck });
    await replyOrPushLineMessage(lineUserId, event.replyToken, emailAck);
    return;
  }

  await db.insert(chatMessages).values({ channel_user_id: lineUserId, lead_id: leadId, role: "user", content: text });

  const priorRows = await db
    .select({ role: chatMessages.role, content: chatMessages.content })
    .from(chatMessages)
    .where(eq(chatMessages.channel_user_id, lineUserId))
    .orderBy(chatMessages.created_at)
    .limit(40);
  const history = trimHistory(priorRows as ChatbotMessage[]);

  const result = await generateChatbotReply(history);
  if (!result.ok) {
    console.error("[webhook] chatbot reply failed:", result.error);
    if (event.replyToken) {
      await replyLineMessage(event.replyToken, "ขออภัยครับ ตอบคำถามไม่สำเร็จ ลองพิมพ์ใหม่อีกครั้งนะครับ 🙏");
    }
    return;
  }

  await db.insert(chatMessages).values({ channel_user_id: lineUserId, lead_id: leadId, role: "assistant", content: result.reply });

  // Fallback net: catch clear commercial intent the model's own marker missed.
  const effectiveIntent = result.intent ?? (detectTrialIntent(text) ? "trial" : undefined);
  const intentMessage = effectiveIntent ? await handleBotIntent(lineUserId, leadId, effectiveIntent) : null;
  if (intentMessage) {
    await db.insert(chatMessages).values({ channel_user_id: lineUserId, lead_id: leadId, role: "assistant", content: intentMessage });
  }

  const messages: LineMessage[] = [{ type: "text", text: result.reply }];
  if (result.card) messages.push(buildChatbotCard(result.card));
  if (intentMessage) messages.push({ type: "text", text: intentMessage });

  await replyOrPushLineMessage(lineUserId, event.replyToken, messages);
}
