import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { paymentOrders, users, setPurchases, creditPurchases } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { addCredits } from "@/lib/db/queries-credits";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await db
    .select({
      id: paymentOrders.id,
      user_id: paymentOrders.user_id,
      order_type: paymentOrders.order_type,
      plan_type: paymentOrders.plan_type,
      set_id: paymentOrders.set_id,
      amount: paymentOrders.amount,
      slip_url: paymentOrders.slip_url,
      status: paymentOrders.status,
      created_at: paymentOrders.created_at,
      user_email: users.email,
      user_name: users.name,
    })
    .from(paymentOrders)
    .leftJoin(users, eq(paymentOrders.user_id, users.id))
    .orderBy(desc(paymentOrders.created_at));

  return NextResponse.json(orders);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, action } = await req.json();
  if (!orderId || !["approved", "rejected"].includes(action)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const order = await db
    .select()
    .from(paymentOrders)
    .where(eq(paymentOrders.id, orderId))
    .then(rows => rows[0]);

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db
    .update(paymentOrders)
    .set({ status: action, reviewed_at: new Date().toISOString() })
    .where(eq(paymentOrders.id, orderId));

  if (action === "approved" && order.user_id) {
    if (order.order_type === "set" && order.set_id) {
      // Activate set purchase
      await db
        .update(setPurchases)
        .set({ status: "active", purchased_at: new Date().toISOString() })
        .where(eq(setPurchases.payment_order_id, orderId));
    } else if (order.order_type === "credit") {
      // Activate credit purchase(s) and top up the balance in ONE transaction.
      // The "pending" guard makes re-approval a no-op (no double credits), and
      // atomicity means a failure rolls back the activation so approve can be
      // retried safely.
      await db.transaction(async (tx) => {
        const pending = await tx
          .update(creditPurchases)
          .set({ status: "active", purchased_at: new Date().toISOString() })
          .where(
            and(
              eq(creditPurchases.payment_order_id, orderId),
              eq(creditPurchases.status, "pending")
            )
          )
          .returning({ amount_credits: creditPurchases.amount_credits });

        const totalCredits = pending.reduce((s, r) => s + r.amount_credits, 0);
        if (totalCredits > 0) {
          await addCredits(
            order.user_id!,
            totalCredits,
            { type: "purchase", relatedId: orderId, note: "manual slip top-up" },
            tx
          );
        }
      });
    } else {
      // Update subscription membership
      const expiresAt = new Date();
      if (order.plan_type === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
      else if (order.plan_type === "yearly") expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      else expiresAt.setFullYear(expiresAt.getFullYear() + 99);

      await db
        .update(users)
        .set({
          membership_type: order.plan_type as "monthly" | "yearly",
          membership_expires_at: expiresAt.toISOString(),
        })
        .where(eq(users.id, order.user_id));
    }
  }

  return NextResponse.json({ success: true });
}
