import { getResend, fromEmail } from "@/lib/email/resend";

export async function sendRedeemCodeEmail(
  to: string,
  code: string,
  expiresAt: string,
  isFirst: boolean
): Promise<void> {
  const subject = isFirst
    ? "🎁 โค้ดทดลองใช้ PharmRoo ของคุณมาแล้ว!"
    : "🔄 โค้ดทดลองใช้ PharmRoo ตัวใหม่ของคุณ";

  const expiryDisplay = expiresAt.slice(0, 10);

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h2 style="color: #8B5CF6;">💊 PharmRoo</h2>
  <p>สวัสดีครับ!</p>
  <p>${isFirst ? "ขอบคุณที่สนใจ PharmRoo นะครับ พี่มีโค้ดทดลองให้น้องเลย:" : "นี่คือโค้ดทดลองตัวใหม่ของน้องครับ:"}</p>
  <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
    <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #8B5CF6;">${code}</span>
    <p style="margin: 8px 0 0; color: #6B7280; font-size: 14px;">หมดอายุ ${expiryDisplay}</p>
  </div>
  <p><strong>วิธีใช้:</strong></p>
  <ol style="padding-left: 20px; color: #374151;">
    <li>ไปที่ <a href="https://pharmroo.com/pricing" style="color: #8B5CF6;">pharmroo.com/pricing</a></li>
    <li>เลือกแพ็กเกจที่ต้องการ</li>
    <li>กรอกโค้ดในช่อง "รหัสส่วนลด" ตอน checkout</li>
  </ol>
  <p style="color: #6B7280; font-size: 13px; margin-top: 32px;">มีคำถาม? LINE OA: @pharmroo หรือ email: support@pharmroo.com</p>
</body>
</html>`;

  await getResend().emails.send({ from: fromEmail, to, subject, html });
}

export async function sendLeadFollowupEmail(
  to: string,
  name: string | null,
  day: number,
  code?: string,
  expiresAt?: string
): Promise<void> {
  const displayName = name ?? "น้อง";

  const subjects: Record<number, string> = {
    1: `${displayName} ลืมโค้ดทดลอง PharmRoo แล้วหรือเปล่า? 📚`,
    3: `อีก 4 วัน โค้ดทดลอง PharmRoo จะหมดอายุนะครับ ⏰`,
    6: `พรุ่งนี้โค้ดทดลอง PharmRoo หมดอายุแล้วครับ! ⚡`,
  };

  const bodies: Record<number, string> = {
    1: `สวัสดีครับ ${displayName}!\n\nเมื่อวานพี่ส่งโค้ดทดลอง PharmRoo ให้แล้ว ลองใช้ดูได้เลยนะครับ ข้อสอบ PLE และ NLE รออยู่เลย! 💊`,
    3: `สวัสดีครับ ${displayName}!\n\nโค้ดทดลอง PharmRoo จะหมดอายุในอีก 4 วันนะครับ อย่าลืมใช้ด้วยล่ะ 📚`,
    6: `สวัสดีครับ ${displayName}!\n\nพรุ่งนี้โค้ดจะหมดอายุแล้วครับ! นี่โอกาสสุดท้ายที่จะลองข้อสอบ PLE/NLE พร้อม AI อธิบายละเอียด ⚡`,
  };

  const codeSection = code
    ? `
  <div style="background: #F3F4F6; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
    <span style="font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #8B5CF6;">${code}</span>
    ${expiresAt ? `<p style="margin: 6px 0 0; color: #6B7280; font-size: 13px;">หมดอายุ ${expiresAt.slice(0, 10)}</p>` : ""}
  </div>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h2 style="color: #8B5CF6;">💊 PharmRoo</h2>
  <p style="white-space: pre-line;">${bodies[day]}</p>
  ${codeSection}
  <p><a href="https://pharmroo.com/pricing" style="background: #8B5CF6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">ใช้โค้ดเลย →</a></p>
</body>
</html>`;

  await getResend().emails.send({
    from: fromEmail,
    to,
    subject: subjects[day] ?? `ติดตามจาก PharmRoo`,
    html,
  });
}

export async function sendTrialExpiryEmail(
  to: string,
  name: string | null,
  daysBeforeExpiry: number
): Promise<void> {
  const displayName = name ?? "น้อง";

  const subject =
    daysBeforeExpiry === 3
      ? `${displayName} Trial PharmRoo จะหมดอีก 3 วัน — ต่ออายุได้เลย 🕐`
      : `${displayName} Trial PharmRoo จะหมดพรุ่งนี้! ⚡`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h2 style="color: #8B5CF6;">💊 PharmRoo</h2>
  <p>สวัสดีครับ ${displayName}!</p>
  <p>Trial PharmRoo ของน้องจะหมดอายุใน <strong>${daysBeforeExpiry} วัน</strong> ครับ อย่าลืมต่ออายุเพื่อเตรียมสอบต่อเนื่องนะครับ 📚</p>
  <p><a href="https://pharmroo.com/pricing" style="background: #8B5CF6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">ต่ออายุ PharmRoo →</a></p>
  <p style="color: #6B7280; font-size: 13px;">รายเดือน ฿249 | รายปี ฿1,490 (ประหยัด ฿1,498)</p>
</body>
</html>`;

  await getResend().emails.send({ from: fromEmail, to, subject, html });
}
