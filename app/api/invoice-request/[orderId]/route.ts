import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createCashInvoice } from "@/lib/flowaccount";

// GET — ดึงข้อมูล invoice สำหรับแสดงในฟอร์ม
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const invoice = await db
    .select({
      invoice_number: invoices.invoice_number,
      plan_type: invoices.plan_type,
      order_type: invoices.order_type,
      set_name: invoices.set_name,
      total_amount: invoices.total_amount,
      buyer_name: invoices.buyer_name,
      buyer_tax_id: invoices.buyer_tax_id,
      buyer_address: invoices.buyer_address,
      buyer_email: invoices.buyer_email,
      status: invoices.status,
    })
    .from(invoices)
    .where(eq(invoices.order_id, orderId))
    .then((rows) => rows[0]);

  if (!invoice) {
    return NextResponse.json(
      { error: "ไม่พบข้อมูลคำสั่งซื้อ" },
      { status: 404 }
    );
  }

  return NextResponse.json(invoice);
}

// POST — รับข้อมูลจากลูกค้า → อัพเดท invoice → สร้าง FlowAccount (ถ้ามี credentials)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const body = (await request.json()) as {
    buyerName?: string;
    buyerTaxId?: string;
    buyerAddress?: string;
    buyerEmail?: string;
  };

  if (!body.buyerName?.trim()) {
    return NextResponse.json(
      { error: "กรุณาระบุชื่อ" },
      { status: 400 }
    );
  }

  // ดึง invoice เดิม
  const invoice = await db
    .select({
      id: invoices.id,
      invoice_number: invoices.invoice_number,
      plan_type: invoices.plan_type,
      order_type: invoices.order_type,
      set_name: invoices.set_name,
      amount: invoices.amount,
      vat_amount: invoices.vat_amount,
      total_amount: invoices.total_amount,
      stripe_session_id: invoices.stripe_session_id,
      issued_at: invoices.issued_at,
    })
    .from(invoices)
    .where(eq(invoices.order_id, orderId))
    .then((rows) => rows[0]);

  if (!invoice) {
    return NextResponse.json(
      { error: "ไม่พบข้อมูลคำสั่งซื้อ" },
      { status: 404 }
    );
  }

  // อัพเดทข้อมูลผู้ซื้อ
  await db
    .update(invoices)
    .set({
      buyer_name: body.buyerName.trim(),
      buyer_tax_id: body.buyerTaxId?.trim() || null,
      buyer_address: body.buyerAddress?.trim() || null,
      buyer_email: body.buyerEmail?.trim() || null,
    })
    .where(eq(invoices.id, invoice.id));

  const publishedOn = invoice.issued_at
    ? new Date(invoice.issued_at).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  // Determine product name for FlowAccount
  let productName = "PharmRoo";
  if (invoice.plan_type === "monthly") {
    productName = "PharmRoo สมาชิกรายเดือน";
  } else if (invoice.plan_type === "yearly") {
    productName = "PharmRoo สมาชิกรายปี";
  } else if (invoice.set_name) {
    productName = invoice.set_name;
  }

  // สร้างใบกำกับภาษีใน FlowAccount (non-blocking)
  createCashInvoice({
    planType: invoice.plan_type ?? undefined,
    productName,
    totalAmount: invoice.total_amount,
    invoiceNumber: invoice.invoice_number,
    stripeSessionId: invoice.stripe_session_id ?? "",
    buyerName: body.buyerName.trim(),
    buyerTaxId: body.buyerTaxId?.trim() || undefined,
    buyerAddress: body.buyerAddress?.trim() || undefined,
    buyerEmail: body.buyerEmail?.trim() || undefined,
    publishedOn,
  })
    .then((result) => {
      if (result.ok) {
        console.log(
          `[FlowAccount] created doc ${result.documentNumber} for ${invoice.invoice_number}`
        );
      } else {
        console.error(
          `[FlowAccount] failed for ${invoice.invoice_number}: ${result.error}`
        );
      }
    })
    .catch((err) => console.error("[FlowAccount] error:", err));

  return NextResponse.json({ ok: true });
}
