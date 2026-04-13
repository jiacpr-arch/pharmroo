import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, referrals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Apply a referral code to the logged-in user.
 * Creates a pending referral → rewarded when user pays.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { code } = (await request.json()) as { code: string };
  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 });
  }

  // Find referrer by code
  const referrer = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.referral_code, code))
    .then((rows) => rows[0]);

  if (!referrer) {
    return NextResponse.json({ error: "invalid code" }, { status: 404 });
  }

  // Can't refer yourself
  if (referrer.id === session.user.id) {
    return NextResponse.json(
      { error: "cannot refer yourself" },
      { status: 400 }
    );
  }

  // Check if already referred
  const existingReferral = await db
    .select({ id: referrals.id })
    .from(referrals)
    .where(eq(referrals.referred_id, session.user.id))
    .then((rows) => rows[0]);

  if (existingReferral) {
    return NextResponse.json(
      { error: "already referred" },
      { status: 409 }
    );
  }

  // Create pending referral
  await db.insert(referrals).values({
    id: randomUUID(),
    referrer_id: referrer.id,
    referred_id: session.user.id,
    code,
    status: "pending",
    reward_days: 30,
  });

  // Mark user as referred
  await db
    .update(users)
    .set({ referred_by: code })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ ok: true, message: "Referral applied" });
}
