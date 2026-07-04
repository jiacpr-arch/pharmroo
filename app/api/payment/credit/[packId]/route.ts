import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { paymentOrders, creditPurchases, creditPacks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const { packId } = await params;
  const pack = await db
    .select()
    .from(creditPacks)
    .where(eq(creditPacks.id, packId))
    .then((rows) => rows[0]);
  if (!pack || !pack.is_active) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(pack);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ packId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packId } = await params;
  const { slipBase64 } = await req.json();

  const pack = await db
    .select()
    .from(creditPacks)
    .where(eq(creditPacks.id, packId))
    .then((rows) => rows[0]);

  if (!pack || !pack.is_active) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  const orderId = randomUUID();
  await db.insert(paymentOrders).values({
    id: orderId,
    user_id: session.user.id,
    order_type: "credit",
    amount: pack.price,
    slip_url: slipBase64 || "pending",
    status: "pending",
  });

  await db.insert(creditPurchases).values({
    id: randomUUID(),
    user_id: session.user.id,
    pack_id: packId,
    payment_order_id: orderId,
    status: "pending",
    amount_credits: pack.amount_credits,
  });

  return NextResponse.json({ success: true });
}
