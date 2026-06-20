import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillCheckoutSession } from "@/lib/billing/fulfill-checkout";
import { sendFulfillmentNotifications } from "@/lib/billing/send-fulfillment-notifications";
import { reportPurchaseConversion } from "@/lib/analytics/meta-capi";

const SUCCESS_URL = () =>
  `${process.env.NEXT_PUBLIC_SITE_URL || "https://pharmru.com"}/payment/success`;

export const runtime = "nodejs";

// ★ LAZY INIT — never instantiate Stripe at module load
// Stripe v21 throws if API key is missing at construction.
// Next.js imports every route module at build time.
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim());
  return _stripe;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim()
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ★ GUARANTEE 200 — always ack after valid signature
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const result = await fulfillCheckoutSession(session);

      if (result.notify) {
        // ★ Side effects run after response using fire-and-forget
        // In Next.js 15.1+ use after(), here using Promise for compatibility
        const notify = result.notify;
        sendFulfillmentNotifications(notify).catch((err) =>
          console.error("[webhook] notification error:", err)
        );

        // Server-side Purchase → Meta CAPI. Guarded by `notify` so it fires
        // exactly once (only on the first fulfillment of this session), and
        // de-duplicates with the browser pixel via eventId = session id.
        reportPurchaseConversion({
          sessionId: notify.stripeSessionId,
          value: notify.totalAmount,
          currency: "THB",
          email: notify.invoiceEmail,
          userId: notify.userId,
          fbp: session.metadata?.fbp,
          fbc: session.metadata?.fbc,
          eventSourceUrl: SUCCESS_URL(),
        }).catch((err) =>
          console.error("[webhook] meta capi error:", err)
        );
      }
    }
  } catch (err) {
    console.error("[webhook] handler error:", err);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
