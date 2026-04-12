import type Stripe from "stripe";
import { db } from "@/lib/db";
import {
  paymentOrders,
  users,
  setPurchases,
  invoices,
  questionSets,
  referrals,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { STRIPE_PRICES } from "@/lib/stripe";

export interface FulfillmentResult {
  alreadyProcessed: boolean;
  notify?: FulfillmentNotifyPayload;
}

export interface FulfillmentNotifyPayload {
  sessionId: string;
  userId: string;
  planType: string;
  planLabel: string;
  totalAmount: number;
  amountBeforeVat: number;
  vatAmount: number;
  invoiceNumber: string;
  orderId: string;
  publishedOn: string;
  expiresAt: string | null;
  invoiceName: string;
  invoiceTaxId: string;
  invoiceAddress: string;
  invoiceEmail: string;
  buyerLineUserId: string | null;
  referrerLineUserId: string | null;
  referrerRewardDays: number;
  productName: string;
  stripeSessionId: string;
}

/**
 * Idempotent fulfillment — keyed on stripe_session_id.
 * Called by webhook, success-page verify, and daily reconcile cron.
 * Safe to call multiple times for the same session.
 */
export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<FulfillmentResult> {
  const metadata = session.metadata ?? {};
  const userId = metadata.userId ?? metadata.user_id;
  const planType = metadata.planType ?? metadata.plan;
  const orderType = metadata.type ?? "subscription";
  const setId = metadata.set_id;

  if (!userId || !planType) {
    console.error("[fulfill] missing metadata on session:", session.id);
    return { alreadyProcessed: false };
  }

  // ★ IDEMPOTENCY GUARD
  const existing = await db
    .select({ id: paymentOrders.id })
    .from(paymentOrders)
    .where(eq(paymentOrders.stripe_session_id, session.id))
    .then((rows) => rows[0]);

  if (existing) {
    return { alreadyProcessed: true };
  }

  const totalAmount = (session.amount_total ?? 0) / 100;
  const now = new Date();
  const publishedOn = now.toISOString().slice(0, 10);

  // Calculate VAT (7%)
  const amountBeforeVat = Math.round((totalAmount / 1.07) * 100) / 100;
  const vatAmount = Math.round((totalAmount - amountBeforeVat) * 100) / 100;

  // Generate invoice number
  const year = now.getFullYear();
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(invoices);
  const seq = (Number(countResult[0]?.count ?? 0) + 1)
    .toString()
    .padStart(4, "0");
  const invoiceNumber = `INV-${year}-${seq}`;

  let productName = "";
  let expiresAt: string | null = null;

  // Create payment order
  const orderId = randomUUID();
  await db.insert(paymentOrders).values({
    id: orderId,
    user_id: userId,
    order_type: orderType as "subscription" | "set",
    plan_type: planType as "monthly" | "yearly",
    set_id: setId ?? null,
    amount: totalAmount,
    status: "approved",
    reviewed_at: now.toISOString(),
    stripe_session_id: session.id,
    payment_method: "stripe",
  });

  // Fulfillment based on type
  if (orderType === "subscription") {
    const exp = new Date();
    if (planType === "monthly") exp.setMonth(exp.getMonth() + 1);
    else if (planType === "yearly") exp.setFullYear(exp.getFullYear() + 1);
    expiresAt = exp.toISOString();

    await db
      .update(users)
      .set({
        membership_type: planType as "monthly" | "yearly",
        membership_expires_at: expiresAt,
      })
      .where(eq(users.id, userId));

    const priceInfo = STRIPE_PRICES[planType as keyof typeof STRIPE_PRICES];
    productName = priceInfo?.name ?? `PharmRoo ${planType}`;
  } else if (orderType === "set" && setId) {
    await db.insert(setPurchases).values({
      id: randomUUID(),
      user_id: userId,
      set_id: setId,
      payment_order_id: orderId,
      status: "active",
      purchased_at: now.toISOString(),
    });

    const setRow = await db
      .select()
      .from(questionSets)
      .where(eq(questionSets.id, setId))
      .then((rows) => rows[0]);
    productName = setRow?.name_th || setRow?.name || `ชุดข้อสอบ ${setId}`;
  }

  // Create invoice record
  const buyerEmail = session.customer_email ?? "";
  const invoiceName = metadata.invoiceName ?? "";
  const invoiceTaxId = metadata.invoiceTaxId ?? "";
  const invoiceAddress = metadata.invoiceAddress ?? "";

  await db
    .insert(invoices)
    .values({
      id: randomUUID(),
      invoice_number: invoiceNumber,
      user_id: userId,
      order_id: orderId,
      payment_method: "stripe",
      stripe_session_id: session.id,
      plan_type: planType,
      order_type: orderType as "subscription" | "set",
      set_name: orderType === "set" ? productName : null,
      amount: amountBeforeVat,
      vat_amount: vatAmount,
      total_amount: totalAmount,
      buyer_name: invoiceName || null,
      buyer_tax_id: invoiceTaxId || null,
      buyer_address: invoiceAddress || null,
      buyer_email: buyerEmail || null,
      status: "paid",
    })
    .catch((err) => console.error("[fulfill] invoice insert error:", err));

  // Check referral reward
  let referrerLineUserId: string | null = null;
  let referrerRewardDays = 0;

  const referral = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referred_id, userId))
    .then((rows) => rows.find((r) => r.status === "pending"));

  if (referral) {
    referrerRewardDays = referral.reward_days;

    // Extend referrer's membership
    const referrer = await db
      .select()
      .from(users)
      .where(eq(users.id, referral.referrer_id))
      .then((rows) => rows[0]);

    if (referrer) {
      referrerLineUserId = referrer.line_user_id ?? null;
      const currentExpiry = referrer.membership_expires_at
        ? new Date(referrer.membership_expires_at)
        : new Date();
      const base = currentExpiry > new Date() ? currentExpiry : new Date();
      base.setDate(base.getDate() + referral.reward_days);

      await db
        .update(users)
        .set({ membership_expires_at: base.toISOString() })
        .where(eq(users.id, referral.referrer_id));

      await db
        .update(referrals)
        .set({ status: "rewarded", rewarded_at: now.toISOString() })
        .where(eq(referrals.id, referral.id));
    }
  }

  // Fetch buyer's LINE user ID for notification
  const buyer = await db
    .select({ line_user_id: users.line_user_id })
    .from(users)
    .where(eq(users.id, userId))
    .then((rows) => rows[0]);

  return {
    alreadyProcessed: false,
    notify: {
      sessionId: session.id,
      userId,
      planType,
      planLabel: productName,
      totalAmount,
      amountBeforeVat,
      vatAmount,
      invoiceNumber,
      orderId,
      publishedOn,
      expiresAt,
      invoiceName,
      invoiceTaxId,
      invoiceAddress,
      invoiceEmail: buyerEmail,
      buyerLineUserId: buyer?.line_user_id ?? null,
      referrerLineUserId,
      referrerRewardDays,
      productName,
      stripeSessionId: session.id,
    },
  };
}
