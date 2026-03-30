import { NextRequest, NextResponse } from "next/server";
import { createStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { paymentOrders, users, setPurchases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = createStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });

    const { order_id, user_id, type, plan, set_id } = session.metadata || {};
    if (!order_id || !user_id || !type) return NextResponse.json({ received: true });

    // Mark order as approved
    await db
      .update(paymentOrders)
      .set({ status: "approved", reviewed_at: new Date().toISOString() })
      .where(eq(paymentOrders.id, order_id));

    if (type === "subscription" && plan) {
      const expiresAt = new Date();
      if (plan === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
      else if (plan === "yearly") expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      await db
        .update(users)
        .set({
          membership_type: plan as "monthly" | "yearly",
          membership_expires_at: expiresAt.toISOString(),
        })
        .where(eq(users.id, user_id));
    } else if (type === "set" && set_id) {
      // Check if setPurchase already exists
      const existing = await db
        .select()
        .from(setPurchases)
        .where(eq(setPurchases.payment_order_id, order_id))
        .then(rows => rows[0]);

      if (existing) {
        await db
          .update(setPurchases)
          .set({ status: "active", purchased_at: new Date().toISOString() })
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
    }
  }

  return NextResponse.json({ received: true });
}
