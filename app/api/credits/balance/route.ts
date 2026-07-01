import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserCreditBalance } from "@/lib/db/queries-credits";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ credit_balance: 0 });
  }
  const balance = await getUserCreditBalance(session.user.id);
  return NextResponse.json({ credit_balance: balance });
}
