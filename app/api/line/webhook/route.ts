import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyLineMessage } from "@/lib/line";
import { LINE_BONUS_DAYS, grantLineBonus, lineBonusMessage } from "@/lib/line-bonus";
import { db } from "@/lib/db";
import { lineLinkCodes, users } from "@/lib/db/schema";
import { eq, and, gt, ne } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pharmru.com";

export const runtime = "nodejs";

interface LineEvent {
  type: string;
  replyToken: string;
  source: { userId: string; type: string };
  message?: { type: string; text: string };
}

/**
 * LINE OA Webhook — handles follow events + link code messages.
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
      // Accounts created via LINE login already carry this LINE userId, so
      // following the OA is enough to claim the new-member bonus.
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.line_user_id, event.source.userId))
        .then((rows) => rows[0]);
      const bonusExpiresAt = existing ? await grantLineBonus(existing.id) : null;

      await replyLineMessage(
        event.replyToken,
        bonusExpiresAt
          ? `สวัสดีครับ! 🎉\nยินดีต้อนรับสู่ PharmRoo\n\n${lineBonusMessage(bonusExpiresAt)}`
          : existing
            ? `สวัสดีครับ! 🎉\nยินดีต้อนรับกลับสู่ PharmRoo\n\nทำข้อสอบต่อ 👉 ${SITE_URL}/ple`
            : `สวัสดีครับ! 🎉\nยินดีต้อนรับสู่ PharmRoo\n\n🎁 สมาชิกใหม่รับ Premium ฟรี ${LINE_BONUS_DAYS} วัน!\nกด "เข้าสู่ระบบด้วย LINE" ที่ ${SITE_URL}/login ระบบจะเปิดสิทธิ์ให้อัตโนมัติ\n\nสมัครด้วยอีเมลไว้แล้ว? ไปที่ ${SITE_URL}/profile กด "สร้างรหัสเชื่อมต่อ" แล้วส่งรหัส PHARMROO-XXXXXX ในแชทนี้`
      );
    } else if (
      event.type === "message" &&
      event.message?.type === "text" &&
      event.message.text.startsWith("PHARMROO-")
    ) {
      // Link code attempt
      const code = event.message.text.trim();
      const lineUserId = event.source.userId;
      const now = new Date().toISOString();

      const linkCode = await db
        .select()
        .from(lineLinkCodes)
        .where(
          and(
            eq(lineLinkCodes.code, code),
            gt(lineLinkCodes.expires_at, now)
          )
        )
        .then((rows) => rows[0]);

      const linkedElsewhere = linkCode
        ? await db
            .select({ id: users.id })
            .from(users)
            .where(
              and(
                eq(users.line_user_id, lineUserId),
                ne(users.id, linkCode.user_id)
              )
            )
            .then((rows) => rows[0])
        : undefined;

      if (linkCode && linkedElsewhere) {
        // users.line_user_id is unique: linking would fail, and it would let
        // one LINE account claim the bonus on several web accounts.
        await replyLineMessage(
          event.replyToken,
          "⚠️ LINE นี้เชื่อมต่อกับบัญชีฟาร์มรู้อื่นอยู่แล้ว\nหากต้องการความช่วยเหลือ พิมพ์บอกแอดมินในแชทนี้ได้เลย"
        );
      } else if (linkCode) {
        // Link the account
        await db
          .update(users)
          .set({
            line_user_id: lineUserId,
            line_linked_at: now,
          })
          .where(eq(users.id, linkCode.user_id));

        // Delete used code
        await db.delete(lineLinkCodes).where(eq(lineLinkCodes.id, linkCode.id));

        const bonusExpiresAt = await grantLineBonus(linkCode.user_id);

        await replyLineMessage(
          event.replyToken,
          bonusExpiresAt
            ? `✅ เชื่อมต่อบัญชีสำเร็จ!\nคุณจะได้รับแจ้งเตือนผ่าน LINE แล้ว\n\n${lineBonusMessage(bonusExpiresAt)}`
            : "✅ เชื่อมต่อบัญชีสำเร็จ!\nคุณจะได้รับแจ้งเตือนผ่าน LINE แล้ว"
        );
      } else {
        await replyLineMessage(
          event.replyToken,
          "❌ รหัสไม่ถูกต้องหรือหมดอายุ\nกรุณาสร้างรหัสใหม่จากหน้า Profile"
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
