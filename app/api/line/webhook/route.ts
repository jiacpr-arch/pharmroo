import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyOrPushLineMessage, replyLineMessage } from "@/lib/line";
import { LINE_BONUS_DAYS, grantLineBonus, lineBonusMessage } from "@/lib/line-bonus";
import { buildFollowGreetingFlex } from "@/lib/line-flex-templates";
import { buildNonTextGreeting, isNonTextMessage } from "@/lib/line-greeting";
import { handleDailyMcqPostback } from "@/lib/daily-mcq-line";
import { db } from "@/lib/db";
import { lineLinkCodes, lineUnfollowEvents, users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

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
        : `ส่งรหัสเชื่อมต่อจากหน้า Profile เพื่อรับแจ้งเตือนผ่าน LINE\n\n🎁 สมาชิกใหม่เชื่อมต่อ LINE รับ Premium ฟรี ${LINE_BONUS_DAYS} วัน!`
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
  if (!text.startsWith("PHARMROO-")) return; // no chatbot yet — ignore other text

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
