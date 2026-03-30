import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { paymentOrders, questionSets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createStripe, STRIPE_PRICES } from "@/lib/stripe";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, plan, setId, invoiceData } = await req.json();
  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "https://pharma.morroo.com";

  let lineItems: { price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number }[];
  let orderId: string;
  let metadata: Record<string, string>;

  if (type === "subscription" && plan && STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES]) {
    const priceInfo = STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES];
    orderId = randomUUID();
    lineItems = [
      {
        price_data: {
          currency: "thb",
          product_data: { name: priceInfo.name },
          unit_amount: priceInfo.amount,
        },
        quantity: 1,
      },
    ];
    metadata = {
      order_id: orderId,
      user_id: session.user.id,
      type: "subscription",
      plan,
    };

    await db.insert(paymentOrders).values({
      id: orderId,
      user_id: session.user.id,
      order_type: "subscription",
      plan_type: plan as "monthly" | "yearly",
      amount: priceInfo.amount / 100,
      slip_url: "stripe",
      status: "pending",
      ...(invoiceData?.requested && {
        invoice_requested: true,
        invoice_type: invoiceData.type,
        invoice_name: invoiceData.name,
        invoice_tax_id: invoiceData.taxId,
        invoice_address: invoiceData.address,
        invoice_branch: invoiceData.branch || null,
      }),
    });
  } else if (type === "set" && setId) {
    const set = await db.select().from(questionSets).where(eq(questionSets.id, setId)).then(rows => rows[0]);
    if (!set || !set.is_active) {
      return NextResponse.json({ error: "Set not found" }, { status: 404 });
    }

    orderId = randomUUID();
    lineItems = [
      {
        price_data: {
          currency: "thb",
          product_data: { name: set.name_th || set.name },
          unit_amount: Math.round(set.price * 100),
        },
        quantity: 1,
      },
    ];
    metadata = {
      order_id: orderId,
      user_id: session.user.id,
      type: "set",
      set_id: setId,
    };

    await db.insert(paymentOrders).values({
      id: orderId,
      user_id: session.user.id,
      order_type: "set",
      set_id: setId,
      amount: set.price,
      slip_url: "stripe",
      status: "pending",
      ...(invoiceData?.requested && {
        invoice_requested: true,
        invoice_type: invoiceData.type,
        invoice_name: invoiceData.name,
        invoice_tax_id: invoiceData.taxId,
        invoice_address: invoiceData.address,
        invoice_branch: invoiceData.branch || null,
      }),
    });
  } else {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const stripeClient = createStripe();
  const checkoutSession = await stripeClient.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    currency: "thb",
    customer_email: session.user.email,
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: type === "set" ? `${origin}/payment/set/${setId}` : `${origin}/payment/${plan}`,
    metadata,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
