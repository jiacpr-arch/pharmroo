import type { FulfillmentNotifyPayload } from "./fulfill-checkout";
import { sendLineMessage } from "@/lib/line";
import { createCashInvoice } from "@/lib/flowaccount";
import { getResend, fromEmail } from "@/lib/email/resend";

/**
 * Post-response side effects — each integration in its own try/catch.
 * One failing won't break others.
 */
export async function sendFulfillmentNotifications(
  data: FulfillmentNotifyPayload
): Promise<void> {
  // 1. LINE notify referrer (if applicable)
  if (data.referrerLineUserId && data.referrerRewardDays > 0) {
    try {
      await sendLineMessage(
        data.referrerLineUserId,
        `🎉 เพื่อนที่คุณชวนสมัครแล้ว! คุณได้รับสิทธิ์เพิ่ม +${data.referrerRewardDays} วัน`
      );
    } catch (err) {
      console.error("[notify] referrer LINE failed:", err);
    }
  }

  // 2. LINE notify buyer
  if (data.buyerLineUserId) {
    try {
      await sendLineMessage(
        data.buyerLineUserId,
        [
          `✅ ชำระเงินสำเร็จ`,
          `แพ็กเกจ: ${data.planLabel}`,
          `จำนวน: ฿${data.totalAmount.toLocaleString()}`,
          data.expiresAt
            ? `หมดอายุ: ${new Date(data.expiresAt).toLocaleDateString("th-TH")}`
            : "",
          `เลขที่: ${data.invoiceNumber}`,
        ]
          .filter(Boolean)
          .join("\n")
      );
    } catch (err) {
      console.error("[notify] buyer LINE failed:", err);
    }
  }

  // 3. Admin notifications (LINE group + email) — parallel
  const adminNotifications: Promise<void>[] = [];

  // LINE admin group
  const lineTargetId = process.env.LINE_TARGET_ID;
  if (lineTargetId) {
    adminNotifications.push(
      sendLineMessage(
        lineTargetId,
        `🛒 ออเดอร์ใหม่\n${data.planLabel} ฿${data.totalAmount}\n${data.invoiceEmail}\n${data.invoiceNumber}`
      ).catch((err) => console.error("[notify] admin LINE failed:", err))
    );
  }

  // Email admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    adminNotifications.push(
      getResend()
        .emails.send({
          from: fromEmail,
          to: adminEmail.split(",").map((e) => e.trim()),
          subject: `🛒 ออเดอร์ใหม่ — ${data.planLabel} ฿${data.totalAmount}`,
          html: `
            <h2>ออเดอร์ใหม่</h2>
            <p>แพ็กเกจ: ${data.planLabel}</p>
            <p>จำนวน: ฿${data.totalAmount}</p>
            <p>อีเมล: ${data.invoiceEmail}</p>
            <p>เลขที่: ${data.invoiceNumber}</p>
            <p>Order ID: ${data.orderId}</p>
          `,
        })
        .catch((err) => console.error("[notify] admin email failed:", err))
    );
  }

  // Email receipt to buyer
  if (data.invoiceEmail) {
    adminNotifications.push(
      getResend()
        .emails.send({
          from: fromEmail,
          to: data.invoiceEmail,
          subject: `ใบเสร็จรับเงิน PharmRoo — ${data.invoiceNumber}`,
          html: `
            <h2>ใบเสร็จรับเงิน</h2>
            <p>เลขที่: ${data.invoiceNumber}</p>
            <p>แพ็กเกจ: ${data.planLabel}</p>
            <p>ราคาก่อน VAT: ฿${data.amountBeforeVat.toFixed(2)}</p>
            <p>VAT 7%: ฿${data.vatAmount.toFixed(2)}</p>
            <p><strong>รวม: ฿${data.totalAmount.toFixed(2)}</strong></p>
            <p>วันที่: ${data.publishedOn}</p>
            <hr/>
            <p>ขอบคุณที่ใช้บริการ PharmRoo</p>
          `,
        })
        .catch((err) => console.error("[notify] buyer email failed:", err))
    );
  }

  await Promise.allSettled(adminNotifications);

  // 4. FlowAccount invoice (non-critical)
  try {
    const result = await createCashInvoice({
      planType: data.planType,
      productName: data.productName,
      totalAmount: data.totalAmount,
      invoiceNumber: data.invoiceNumber,
      stripeSessionId: data.stripeSessionId,
      buyerName: data.invoiceName || undefined,
      buyerTaxId: data.invoiceTaxId || undefined,
      buyerAddress: data.invoiceAddress || undefined,
      buyerEmail: data.invoiceEmail || undefined,
      publishedOn: data.publishedOn,
    });
    if (result.ok) {
      console.log(
        `[FlowAccount] created doc ${result.documentNumber} for ${data.invoiceNumber}`
      );
    } else {
      console.error(
        `[FlowAccount] failed for ${data.invoiceNumber}: ${result.error}`
      );
    }
  } catch (err) {
    console.error("[FlowAccount] error:", err);
  }
}
