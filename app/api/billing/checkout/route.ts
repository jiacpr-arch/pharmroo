import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { STRIPE_PRICES } from "@/lib/stripe";

export const runtime = "nodejs";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim());
  return _stripe;
}

const SITE_URL = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://pharmroo.com";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = (await request.json()) as {
    planType: string;
    invoiceName?: string;
    invoiceTaxId?: string;
    invoiceAddress?: string;
  };

  const plan = STRIPE_PRICES[body.planType as keyof typeof STRIPE_PRICES];
  if (!plan) {
    return NextResponse.json({ error: "invalid plan" }, { status: 400 });
  }

  const stripe = getStripe();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "thb",
          unit_amount: plan.amount,
          product_data: { name: plan.name },
        },
        quantity: 1,
      },
    ],
    success_url: `${SITE_URL()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL()}/payment/${body.planType}`,
    metadata: {
      userId: session.user.id,
      planType: body.planType,
      type: "subscription",
      invoiceName: body.invoiceName ?? "",
      invoiceTaxId: body.invoiceTaxId ?? "",
      invoiceAddress: body.invoiceAddress ?? "",
      invoiceEmail: session.user.email ?? "",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
