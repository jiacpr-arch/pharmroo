import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, referrals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Generate or return existing referral code for the logged-in user.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Check if user already has a referral code
  const user = await db
    .select({ referral_code: users.referral_code })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  if (user?.referral_code) {
    return NextResponse.json({
      code: user.referral_code,
      link: `${process.env.NEXT_PUBLIC_SITE_URL || "https://pharmroo.com"}/register?ref=${user.referral_code}`,
    });
  }

  // Generate new code: PR-XXXXXX
  const suffix = randomUUID().slice(0, 6).toUpperCase();
  const code = `PR-${suffix}`;

  await db
    .update(users)
    .set({ referral_code: code })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({
    code,
    link: `${process.env.NEXT_PUBLIC_SITE_URL || "https://pharmroo.com"}/register?ref=${code}`,
  });
}
