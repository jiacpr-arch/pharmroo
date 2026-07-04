import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, referrals, appSettings } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import { addCredits } from "@/lib/db/queries-credits";

/** Signup bonus for the referred friend — free unlocks to try the product. */
const REFERRED_BONUS_CREDITS = 5;

/**
 * Apply a referral code to the logged-in user.
 * Creates a pending referral → rewarded when user pays (subscription).
 * The reward type/amount is stamped at apply time from app_settings
 * (`referral_reward_type`: 'days' | 'credits', `referral_reward_credits`),
 * defaulting to the original 30-days reward.
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

  // Reward configuration (admin-tunable via app_settings; defaults preserved)
  const settings = await db
    .select()
    .from(appSettings)
    .where(
      inArray(appSettings.key, [
        "referral_reward_type",
        "referral_reward_credits",
      ])
    );
  const settingMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const rewardType =
    settingMap["referral_reward_type"] === "credits" ? "credits" : "days";
  const rewardCredits =
    rewardType === "credits"
      ? Math.max(0, Number(settingMap["referral_reward_credits"] ?? 0)) || 25
      : 0;

  // Create pending referral
  await db.insert(referrals).values({
    id: randomUUID(),
    referrer_id: referrer.id,
    referred_id: session.user.id,
    code,
    status: "pending",
    reward_type: rewardType,
    reward_days: 30,
    reward_credits: rewardCredits,
  });

  // Mark user as referred
  await db
    .update(users)
    .set({ referred_by: code })
    .where(eq(users.id, session.user.id));

  // Signup bonus for the referred friend (once — the 409 above guarantees a
  // user can only ever apply one code).
  await addCredits(session.user.id, REFERRED_BONUS_CREDITS, {
    type: "referral",
    relatedId: code,
    note: "referred signup bonus",
  }).catch((err) => console.error("[referral] bonus grant failed:", err));

  return NextResponse.json({
    ok: true,
    message: "Referral applied",
    bonus_credits: REFERRED_BONUS_CREDITS,
  });
}
