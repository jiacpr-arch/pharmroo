/**
 * Transactional email via Resend.
 *
 * No-ops (with a console.warn) when RESEND_API_KEY / RESEND_FROM_EMAIL are
 * unset, so dev / preview environments don't crash on send.
 */
import { Resend } from "resend";

const fromEmail =
  process.env.RESEND_FROM_EMAIL || "ฟาร์มรู้ <noreply@pharmru.com>";

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ id: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email");
    return { id: null };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return { id: null };
  }
  return { id: data?.id ?? null };
}

function welcomeEmailHtml(name: string): string {
  const greeting = name ? `สวัสดีคุณ ${name}` : "สวัสดีค่ะ";
  return `
<div style="font-family:'Sarabun',Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937;line-height:1.7">
  <div style="text-align:center;font-size:40px">💊</div>
  <h1 style="text-align:center;font-size:22px;margin:8px 0 4px">ยินดีต้อนรับสู่ฟาร์มรู้ (PharmRu)!</h1>
  <p style="text-align:center;color:#6b7280;margin-top:0">${greeting} 🎉</p>
  <p>ขอบคุณที่สมัครสมาชิกกับเรา ตอนนี้คุณพร้อมเริ่มเตรียมสอบใบประกอบวิชาชีพ
  (เภสัช PLE / พยาบาล NLE) ได้แล้ว ฝึกฟรีไม่จำกัด พร้อมเฉลยละเอียดทุกข้อ</p>
  <p style="text-align:center;margin:28px 0">
    <a href="https://pharmru.com/dashboard"
       style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;
              padding:12px 28px;border-radius:10px;font-weight:600">
      เริ่มทำข้อสอบเลย
    </a>
  </p>
  <p style="color:#6b7280;font-size:14px">มีคำถามหรืออยากปรึกษา? แอดไลน์เรามาได้เลยที่
  <a href="https://line.me/R/ti/p/@jiacpr" style="color:#16a34a">@jiacpr</a></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
  <p style="color:#9ca3af;font-size:12px;text-align:center">
    ฟาร์มรู้ PharmRu — แพลตฟอร์มข้อสอบใบประกอบวิชาชีพเภสัชและพยาบาล
  </p>
</div>`.trim();
}

/** Send the Thai welcome email after a successful registration. */
export async function sendWelcomeEmail(opts: {
  email: string;
  name?: string;
}): Promise<{ id: string | null }> {
  return sendEmail({
    to: opts.email,
    subject: "ยินดีต้อนรับสู่ฟาร์มรู้! 💊 เริ่มเตรียมสอบได้เลย",
    html: welcomeEmailHtml(opts.name ?? ""),
  });
}
