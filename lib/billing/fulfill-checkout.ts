import type Stripe from "stripe";
import { db } from "@/lib/db";
import {
  paymentOrders,
  users,
  setPurchases,
  creditPacks,
  creditPurchases,
  invoices,
  questionSets,
  referrals,
} from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { STRIPE_PRICES } from "@/lib/stripe";
import { addCredits } from "@/lib/db/queries-credits";

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
  const planType = metadata.planType ?? metadata.plan ?? "";
  const orderType = metadata.type ?? "subscription";
  const setId = metadata.set_id;
  const packId = metadata.pack_id;
  const amountCredits = Number(metadata.amount_credits ?? 0);

  if (!userId) {
    console.error("[fulfill] missing userId on session:", session.id);
    return { alreadyProcessed: false };
  }
  if (orderType === "subscription" && !planType) {
    console.error("[fulfill] missing planType on subscription session:", session.id);
    return { alreadyProcessed: false };
  }

  const totalAmount = (session.amount_total ?? 0) / 100;
  const now = new Date();
  const publishedOn = now.toISOString().slice(0, 10);

  // ★ IDEMPOTENCY GUARD — atomically claim the pending order that checkout
  // pre-created for this session. Only one caller (webhook / verify /
  // reconcile) can flip pending → approved; the rest see alreadyProcessed.
  const claimed = await db
    .update(paymentOrders)
    .set({
      status: "approved",
      reviewed_at: now.toISOString(),
      payment_method: "stripe",
    })
    .where(
      and(
        eq(paymentOrders.stripe_session_id, session.id),
        eq(paymentOrders.status, "pending")
      )
    )
    .returning({ id: paymentOrders.id });

  let orderId: string;
  if (claimed.length > 0) {
    orderId = claimed[0].id;
  } else {
    const existing = await db
      .select({ id: paymentOrders.id })
      .from(paymentOrders)
      .where(eq(paymentOrders.stripe_session_id, session.id))
      .then((rows) => rows[0]);
    if (existing) {
      return { alreadyProcessed: true };
    }
    // No pre-created order for this session (legacy flow) — record one now.
    orderId = randomUUID();
    await db.insert(paymentOrders).values({
      id: orderId,
      user_id: userId,
      order_type: orderType as "subscription" | "set" | "credit",
      plan_type:
        orderType === "subscription"
          ? (planType as "monthly" | "yearly")
          : null,
      set_id: setId ?? null,
      amount: totalAmount,
      status: "approved",
      reviewed_at: now.toISOString(),
      stripe_session_id: session.id,
      payment_method: "stripe",
    });
  }

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
  } else if (orderType === "credit" && packId) {
    // Activate the pending purchase created at checkout and top up the
    // balance in one transaction (fall back to metadata for legacy sessions
    // that predate the pending creditPurchases row).
    await db.transaction(async (tx) => {
      const activated = await tx
        .update(creditPurchases)
        .set({ status: "active", purchased_at: now.toISOString() })
        .where(
          and(
            eq(creditPurchases.payment_order_id, orderId),
            eq(creditPurchases.status, "pending")
          )
        )
        .returning({ amount_credits: creditPurchases.amount_credits });

      let credits = activated.reduce((s, r) => s + r.amount_credits, 0);
      if (credits === 0 && amountCredits > 0) {
        credits = amountCredits;
        await tx.insert(creditPurchases).values({
          id: randomUUID(),
          user_id: userId,
          pack_id: packId,
          payment_order_id: orderId,
          status: "active",
          amount_credits: credits,
          purchased_at: now.toISOString(),
        });
      }

      if (credits > 0) {
        await addCredits(
          userId,
          credits,
          { type: "purchase", relatedId: orderId, note: "stripe top-up" },
          tx
        );
      }
    });

    // Unfiltered lookup — a since-deactivated pack should still name the invoice.
    const packRow = await db
      .select({ name_th: creditPacks.name_th })
      .from(creditPacks)
      .where(eq(creditPacks.id, packId))
      .then((rows) => rows[0]);
    productName = packRow?.name_th || `${amountCredits} เครดิต`;
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
      plan_type: orderType === "subscription" ? planType : null,
      order_type: orderType as "subscription" | "set" | "credit",
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

  // Check referral reward — subscriptions only. A ฿49 credit pack (or a set
  // purchase) must not consume the referral or pay out the full reward.
  let referrerLineUserId: string | null = null;
  let referrerRewardDays = 0;

  const referral =
    orderType === "subscription"
      ? await db
          .select()
          .from(referrals)
          .where(eq(referrals.referred_id, userId))
          .then((rows) => rows.find((r) => r.status === "pending"))
      : undefined;

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
      planType: orderType === "credit" ? "credit" : planType,
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
