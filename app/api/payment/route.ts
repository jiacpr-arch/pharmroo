import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { paymentOrders } from "@/lib/db/schema";
import { randomUUID } from "crypto";

const PLANS: Record<string, { price: number }> = {
  monthly: { price: 249 },
  yearly: { price: 1490 },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, slipBase64 } = await req.json();

  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  await db.insert(paymentOrders).values({
    id: randomUUID(),
    user_id: session.user.id,
    order_type: "subscription",
    plan_type: plan,
    amount: PLANS[plan].price,
    slip_url: slipBase64 || "pending",
    status: "pending",
  });

  return NextResponse.json({ success: true });
}
