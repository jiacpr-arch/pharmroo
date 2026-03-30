import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { paymentOrders, setPurchases, questionSets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const set = await db.select().from(questionSets).where(eq(questionSets.id, id)).then(rows => rows[0]);
  if (!set || !set.is_active) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(set);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { slipBase64 } = await req.json();

  const set = await db
    .select()
    .from(questionSets)
    .where(eq(questionSets.id, id))
    .then(rows => rows[0]);

  if (!set || !set.is_active) {
    return NextResponse.json({ error: "Set not found" }, { status: 404 });
  }

  const orderId = randomUUID();
  await db.insert(paymentOrders).values({
    id: orderId,
    user_id: session.user.id,
    order_type: "set",
    set_id: id,
    amount: set.price,
    slip_url: slipBase64 || "pending",
    status: "pending",
  });

  await db.insert(setPurchases).values({
    id: randomUUID(),
    user_id: session.user.id,
    set_id: id,
    payment_order_id: orderId,
    status: "pending",
  });

  return NextResponse.json({ success: true });
}
