import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { fulfillCheckoutSession } from "@/lib/billing/fulfill-checkout";
import { sendFulfillmentNotifications } from "@/lib/billing/send-fulfillment-notifications";
import { reportPurchaseConversion } from "@/lib/analytics/meta-capi";

export const runtime = "nodejs";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim());
  return _stripe;
}

/**
 * Success page fallback — verifies payment when user lands on /payment/success.
 * Idempotent: no-op if webhook already processed.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { sessionId } = (await request.json()) as { sessionId?: string };
  if (!sessionId) {
    return NextResponse.json(
      { error: "missing sessionId" },
      { status: 400 }
    );
  }

  try {
    const stripeSession = await getStripe().checkout.sessions.retrieve(sessionId);

    // Verify the session belongs to this user
    const metadata = stripeSession.metadata ?? {};
    const userId = metadata.userId ?? metadata.user_id;
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json({
        status: "pending",
        message: "Payment not yet confirmed",
      });
    }

    const result = await fulfillCheckoutSession(stripeSession);

    // amount_total is in the smallest currency unit (satang for THB).
    const amountTotal = stripeSession.amount_total ?? 0;

    if (result.notify) {
      const notify = result.notify;
      sendFulfillmentNotifications(notify).catch((err) =>
        console.error("[verify] notification error:", err)
      );

      // Server-side Purchase → Meta CAPI, in case the user reaches the success
      // page before the Stripe webhook arrives. Same eventId as the webhook /
      // browser pixel (session id), so Meta still counts it once.
      reportPurchaseConversion({
        sessionId: notify.stripeSessionId,
        value: notify.totalAmount,
        currency: "THB",
        email: notify.invoiceEmail,
        userId: notify.userId,
        fbp: stripeSession.metadata?.fbp,
        fbc: stripeSession.metadata?.fbc,
        eventSourceUrl: request.headers.get("referer") ?? undefined,
      }).catch((err) => console.error("[verify] meta capi error:", err));
    }

    return NextResponse.json({
      status: "ok",
      alreadyProcessed: result.alreadyProcessed,
      amount: amountTotal / 100,
      currency: (stripeSession.currency ?? "thb").toUpperCase(),
    });
  } catch (err) {
    console.error("[verify] error:", err);
    return NextResponse.json(
      { error: "verification failed" },
      { status: 500 }
    );
  }
}
