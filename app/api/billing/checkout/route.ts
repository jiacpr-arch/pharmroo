import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  paymentOrders,
  questionSets,
  creditPacks,
  creditPurchases,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { STRIPE_PRICES } from "@/lib/stripe";
import { promptpayEnabled } from "@/lib/promptpay";

export const runtime = "nodejs";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe)
    _stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim());
  return _stripe;
}

const SITE_URL = () =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://pharmroo.com";

/**
 * Unified checkout — handles both subscription and set purchases.
 * Creates a payment_order row first, then redirects to Stripe.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = (await request.json()) as {
    type: "subscription" | "set" | "credit";
    plan?: string;
    setId?: string;
    packId?: string;
    invoiceData?: {
      requested?: boolean;
      type?: string;
      name?: string;
      taxId?: string;
      address?: string;
      branch?: string;
    };
  };

  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  let cancelUrl: string;
  const orderId = randomUUID();
  const invoiceData = body.invoiceData;
  let packAmountCredits = 0;
  let orderFields: {
    order_type: "subscription" | "set" | "credit";
    plan_type?: "monthly" | "yearly";
    set_id?: string;
    amount: number;
  };

  if (body.type === "subscription" && body.plan) {
    const priceInfo =
      STRIPE_PRICES[body.plan as keyof typeof STRIPE_PRICES];
    if (!priceInfo) {
      return NextResponse.json({ error: "invalid plan" }, { status: 400 });
    }

    lineItems = [
      {
        price_data: {
          currency: "thb",
          unit_amount: priceInfo.amount,
          product_data: { name: priceInfo.name },
        },
        quantity: 1,
      },
    ];
    cancelUrl = `${SITE_URL()}/payment/${body.plan}`;
    orderFields = {
      order_type: "subscription",
      plan_type: body.plan as "monthly" | "yearly",
      amount: priceInfo.amount / 100,
    };
  } else if (body.type === "set" && body.setId) {
    const set = await db
      .select()
      .from(questionSets)
      .where(eq(questionSets.id, body.setId))
      .then((rows) => rows[0]);

    if (!set || !set.is_active) {
      return NextResponse.json({ error: "set not found" }, { status: 404 });
    }

    lineItems = [
      {
        price_data: {
          currency: "thb",
          unit_amount: Math.round(set.price * 100),
          product_data: { name: set.name_th || set.name },
        },
        quantity: 1,
      },
    ];
    cancelUrl = `${SITE_URL()}/payment/set/${body.setId}`;
    orderFields = { order_type: "set", set_id: body.setId, amount: set.price };
  } else if (body.type === "credit" && body.packId) {
    const pack = await db
      .select()
      .from(creditPacks)
      .where(eq(creditPacks.id, body.packId))
      .then((rows) => rows[0]);

    if (!pack || !pack.is_active) {
      return NextResponse.json({ error: "pack not found" }, { status: 404 });
    }

    packAmountCredits = pack.amount_credits;
    lineItems = [
      {
        price_data: {
          currency: "thb",
          unit_amount: Math.round(pack.price * 100),
          product_data: { name: pack.name_th },
        },
        quantity: 1,
      },
    ];
    cancelUrl = `${SITE_URL()}/credits`;
    orderFields = { order_type: "credit", amount: pack.price };
  } else {
    return NextResponse.json({ error: "invalid params" }, { status: 400 });
  }

  await db.insert(paymentOrders).values({
    id: orderId,
    user_id: session.user.id,
    ...orderFields,
    slip_url: "stripe",
    status: "pending",
    stripe_session_id: null,
    payment_method: "stripe",
    ...(invoiceData?.requested && {
      invoice_requested: true,
      invoice_type: invoiceData.type as "personal" | "company",
      invoice_name: invoiceData.name,
      invoice_tax_id: invoiceData.taxId,
      invoice_address: invoiceData.address,
      invoice_branch: invoiceData.branch || null,
    }),
  });

  // Pre-create the pending purchase (like the slip flow) so a lost webhook can
  // still be resolved by manual admin approval.
  if (body.type === "credit" && body.packId) {
    await db.insert(creditPurchases).values({
      id: randomUUID(),
      user_id: session.user.id,
      pack_id: body.packId,
      payment_order_id: orderId,
      status: "pending",
      amount_credits: packAmountCredits,
    });
  }

  const stripe = getStripe();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    currency: "thb",
    customer_email: session.user.email,
    line_items: lineItems,
    success_url: `${SITE_URL()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      userId: session.user.id,
      planType: body.plan ?? "",
      type: body.type,
      set_id: body.setId ?? "",
      pack_id: body.packId ?? "",
      amount_credits: String(packAmountCredits),
      order_id: orderId,
      invoiceName: invoiceData?.name ?? "",
      invoiceTaxId: invoiceData?.taxId ?? "",
      invoiceAddress: invoiceData?.address ?? "",
      invoiceEmail: session.user.email,
    },
  };

  let checkoutSession: Stripe.Checkout.Session;
  if (promptpayEnabled()) {
    // Requires PromptPay activated in the Stripe dashboard. If it isn't
    // (still pending approval, or toggled off), fall back to card-only
    // instead of taking every checkout down.
    try {
      checkoutSession = await stripe.checkout.sessions.create({
        ...sessionParams,
        payment_method_types: ["promptpay", "card"],
      });
    } catch (err) {
      console.error(
        "[checkout] promptpay session failed, retrying card-only:",
        err
      );
      checkoutSession = await stripe.checkout.sessions.create(sessionParams);
    }
  } else {
    checkoutSession = await stripe.checkout.sessions.create(sessionParams);
  }

  // Save Stripe session ID to payment order for idempotency
  if (checkoutSession.id) {
    await db
      .update(paymentOrders)
      .set({ stripe_session_id: checkoutSession.id })
      .where(eq(paymentOrders.id, orderId));
  }

  return NextResponse.json({ url: checkoutSession.url });
}
