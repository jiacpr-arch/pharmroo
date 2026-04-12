import { sendLineMessage } from "@/lib/line";
import { getResend, fromEmail } from "@/lib/email/resend";

/**
 * Notify admin group via LINE.
 */
export async function lineNotifyAdmin(message: string): Promise<void> {
  const targetId = process.env.LINE_TARGET_ID;
  if (!targetId) return;
  await sendLineMessage(targetId, message);
}

/**
 * Send email to admin.
 */
export async function emailNotifyAdmin(
  subject: string,
  html: string
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  await getResend().emails.send({
    from: fromEmail,
    to: adminEmail.split(",").map((e) => e.trim()),
    subject,
    html,
  });
}

/**
 * Send email receipt to buyer.
 */
export async function emailReceipt(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await getResend().emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });
}
