import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyLineMessage } from "@/lib/line";
import { db } from "@/lib/db";
import { lineLinkCodes, users } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

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
      // New follower welcome message
      await replyLineMessage(
        event.replyToken,
        "สวัสดีครับ! 🎉\nยินดีต้อนรับสู่ PharmRoo\n\nส่งรหัสเชื่อมต่อจากหน้า Profile เพื่อรับแจ้งเตือนผ่าน LINE"
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

      if (linkCode) {
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

        await replyLineMessage(
          event.replyToken,
          "✅ เชื่อมต่อบัญชีสำเร็จ!\nคุณจะได้รับแจ้งเตือนผ่าน LINE แล้ว"
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
