import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { paymentOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { fulfillCheckoutSession } from "@/lib/billing/fulfill-checkout";
import { sendFulfillmentNotifications } from "@/lib/billing/send-fulfillment-notifications";

export const runtime = "nodejs";
export const maxDuration = 60;

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim());
  return _stripe;
}

const LOOKBACK_SECONDS = 2 * 24 * 60 * 60; // 2 days
const MAX_SESSIONS = 100;

function isAuthorized(request: NextRequest): boolean {
  // Vercel Cron auto-injects Authorization: Bearer $CRON_SECRET
  const bearer = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");
  if (bearer && bearer === process.env.CRON_SECRET) return true;

  // Fallback: query param
  const secret = request.nextUrl.searchParams.get("secret");
  return !!secret && secret === process.env.CRON_SECRET;
}

/**
 * Daily cron safety net — scans Stripe for missed payments.
 */
async function runReconciliation(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  const since = Math.floor(Date.now() / 1000) - LOOKBACK_SECONDS;

  let scanned = 0;
  let paid = 0;
  let alreadyProcessed = 0;
  let recovered = 0;
  let errors = 0;

  try {
    const sessions = await stripe.checkout.sessions.list({
      created: { gte: since },
      limit: MAX_SESSIONS,
      expand: ["data.line_items"],
    });

    for (const session of sessions.data) {
      scanned++;

      if (session.payment_status !== "paid") continue;
      paid++;

      // Check if already fulfilled
      const existing = await db
        .select({ id: paymentOrders.id })
        .from(paymentOrders)
        .where(eq(paymentOrders.stripe_session_id, session.id))
        .then((rows) => rows[0]);

      if (existing) {
        alreadyProcessed++;
        continue;
      }

      // Recover missed payment
      try {
        const result = await fulfillCheckoutSession(session);
        if (!result.alreadyProcessed && result.notify) {
          await sendFulfillmentNotifications(result.notify);
          recovered++;
        } else {
          alreadyProcessed++;
        }
      } catch (err) {
        console.error("[reconcile] error for session", session.id, err);
        errors++;
      }
    }
  } catch (err) {
    console.error("[reconcile] stripe list error:", err);
    return NextResponse.json(
      { ok: false, error: "Stripe API error" },
      { status: 500 }
    );
  }

  const summary = { scanned, paid, alreadyProcessed, recovered, errors };
  console.log("[reconcile] summary:", summary);

  return NextResponse.json({ ok: true, summary });
}

export async function GET(request: NextRequest) {
  return runReconciliation(request);
}

export async function POST(request: NextRequest) {
  return runReconciliation(request);
}
