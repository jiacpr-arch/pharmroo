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

  const { plan, slipBase64, invoiceData } = await req.json();

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
    ...(invoiceData?.requested && {
      invoice_requested: true,
      invoice_type: invoiceData.type,
      invoice_name: invoiceData.name,
      invoice_tax_id: invoiceData.taxId,
      invoice_address: invoiceData.address,
      invoice_branch: invoiceData.branch || null,
    }),
  });

  return NextResponse.json({ success: true });
}
