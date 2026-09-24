import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, replyLineMessage } from "@/lib/line";
import { db } from "@/lib/db";
import { lineLinkCodes, users } from "@/lib/db/schema";
import { eq, and, gt, ne } from "drizzle-orm";
import { claimLineTrial } from "@/lib/line-trial";
import { LINE_TRIAL_DAYS } from "@/lib/limits";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pharmru.com";

function formatThaiDate(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Bangkok",
  });
}

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
        `สวัสดีครับ! 🎉 ยินดีต้อนรับสู่ฟาร์มรู้\n\n🎁 รับสิทธิ์ทำข้อสอบ Premium ฟรี ${LINE_TRIAL_DAYS} วัน\n1) เข้าสู่ระบบแล้วไปที่หน้าโปรไฟล์\n${SITE_URL}/profile\n2) กด "สร้างรหัสเชื่อมต่อ"\n3) ส่งรหัส PHARMROO-XXXXXX ในแชทนี้\n\nระบบจะเปิดสิทธิ์ให้ทันที`
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

        const trial = await claimLineTrial(linkCode.user_id, lineUserId);
        const trialLine = trial.granted
          ? `\n\n🎁 เปิดสิทธิ์ Premium ฟรี ${LINE_TRIAL_DAYS} วันแล้ว!\nทำข้อสอบได้ไม่จำกัด + ดูเฉลยละเอียดทุกข้อ ถึง ${formatThaiDate(trial.expiresAt)}\n\nเริ่มทำข้อสอบ 👉 ${SITE_URL}/ple`
          : trial.reason === "already_claimed"
            ? "\n\n(สิทธิ์ Premium ฟรีใช้ได้ครั้งเดียวต่อบัญชี และได้รับไปแล้ว)"
            : "";

        await replyLineMessage(
          event.replyToken,
          `✅ เชื่อมต่อบัญชีสำเร็จ!\nคุณจะได้รับแจ้งเตือนผ่าน LINE แล้ว${trialLine}`
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
