import { NextRequest, NextResponse } from "next/server";
import { STRIPE_PRICES } from "@/lib/stripe";
import { db } from "@/lib/db";
import { paymentOrders, users, setPurchases, invoices, questionSets } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { createCashInvoice } from "@/lib/flowaccount";
import Stripe from "stripe";

export const runtime = "nodejs";

// Direct instance for webhook verification — avoids Proxy binding issues
const stripeForWebhook = new Stripe(
  (process.env.STRIPE_SECRET_KEY ?? "").trim()
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const whSecret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();

  let event: Stripe.Event;
  try {
    event = stripeForWebhook.webhooks.constructEvent(body, sig, whSecret);
  } catch (err) {
    console.error("[webhook] sig failed:", String(err).slice(0, 100));
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid")
      return NextResponse.json({ received: true });

    const {
      order_id,
      user_id,
      type,
      plan,
      set_id,
    } = session.metadata || {};
    if (!order_id || !user_id || !type)
      return NextResponse.json({ received: true });

    // Mark order as approved
    await db
      .update(paymentOrders)
      .set({ status: "approved", reviewed_at: new Date().toISOString() })
      .where(eq(paymentOrders.id, order_id));

    // Get invoice data from the order (if user filled it at checkout)
    const orderRow = await db
      .select()
      .from(paymentOrders)
      .where(eq(paymentOrders.id, order_id))
      .then((rows) => rows[0]);

    let productName = "";

    if (type === "subscription" && plan) {
      const expiresAt = new Date();
      if (plan === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
      else if (plan === "yearly")
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      await db
        .update(users)
        .set({
          membership_type: plan as "monthly" | "yearly",
          membership_expires_at: expiresAt.toISOString(),
        })
        .where(eq(users.id, user_id));

      const priceInfo =
        STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES];
      productName = priceInfo?.name ?? `PharmRoo ${plan}`;
    } else if (type === "set" && set_id) {
      // Check if setPurchase already exists
      const existing = await db
        .select()
        .from(setPurchases)
        .where(eq(setPurchases.payment_order_id, order_id))
        .then((rows) => rows[0]);

      if (existing) {
        await db
          .update(setPurchases)
          .set({
            status: "active",
            purchased_at: new Date().toISOString(),
          })
          .where(eq(setPurchases.payment_order_id, order_id));
      } else {
        await db.insert(setPurchases).values({
          id: randomUUID(),
          user_id,
          set_id,
          payment_order_id: order_id,
          status: "active",
          purchased_at: new Date().toISOString(),
        });
      }

      // Get set name for invoice
      const setRow = await db
        .select()
        .from(questionSets)
        .where(eq(questionSets.id, set_id))
        .then((rows) => rows[0]);
      productName = setRow?.name_th || setRow?.name || `ชุดข้อสอบ ${set_id}`;
    }

    // --- Invoice creation ---
    const totalAmount = (session.amount_total ?? 0) / 100;
    const now = new Date();

    // Generate invoice number: INV-YYYY-NNNN
    const year = now.getFullYear();
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices);
    const invoiceCount = Number(countResult[0]?.count ?? 0);
    const sequence = (invoiceCount + 1).toString().padStart(4, "0");
    const invoiceNumber = `INV-${year}-${sequence}`;

    // Calculate VAT (7%)
    const amountBeforeVat =
      Math.round((totalAmount / 1.07) * 100) / 100;
    const vatAmount =
      Math.round((totalAmount - amountBeforeVat) * 100) / 100;

    // Get buyer email from Stripe session
    const buyerEmail = session.customer_email ?? "";

    // Invoice data from order (if user requested at checkout)
    const invoiceName = orderRow?.invoice_name ?? "";
    const invoiceTaxId = orderRow?.invoice_tax_id ?? "";
    const invoiceAddress = orderRow?.invoice_address ?? "";

    // Create invoice record
    const { error: invoiceError } = await db
      .insert(invoices)
      .values({
        id: randomUUID(),
        invoice_number: invoiceNumber,
        user_id,
        order_id,
        payment_method: "stripe",
        stripe_session_id: session.id,
        plan_type: plan ?? null,
        order_type: type as "subscription" | "set",
        set_name: type === "set" ? productName : null,
        amount: amountBeforeVat,
        vat_amount: vatAmount,
        total_amount: totalAmount,
        buyer_name: invoiceName || null,
        buyer_tax_id: invoiceTaxId || null,
        buyer_address: invoiceAddress || null,
        buyer_email: buyerEmail || null,
        status: "paid",
      })
      .returning()
      .then(() => ({ error: null }))
      .catch((err) => ({ error: err }));

    if (invoiceError) {
      console.error("Failed to create invoice:", invoiceError);
    }

    const publishedOn = now.toISOString().slice(0, 10);

    // สร้างใบกำกับภาษี/ใบเสร็จใน FlowAccount (non-blocking)
    createCashInvoice({
      planType: plan ?? undefined,
      productName: productName || `PharmRoo ${type}`,
      totalAmount,
      invoiceNumber,
      stripeSessionId: session.id,
      buyerName: invoiceName || undefined,
      buyerTaxId: invoiceTaxId || undefined,
      buyerAddress: invoiceAddress || undefined,
      buyerEmail: buyerEmail || undefined,
      publishedOn,
    })
      .then((result) => {
        if (result.ok) {
          console.log(
            `[FlowAccount] created doc ${result.documentNumber} for ${invoiceNumber}`
          );
        } else {
          console.error(
            `[FlowAccount] failed for ${invoiceNumber}: ${result.error}`
          );
        }
      })
      .catch((err) => {
        console.error("[FlowAccount] error:", err);
      });
  }

  return NextResponse.json({ received: true });
}
