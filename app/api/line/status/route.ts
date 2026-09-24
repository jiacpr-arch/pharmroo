import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

/**
 * LINE link + link-LINE trial status for the signed-in user. The profile page
 * polls this after showing a link code so it can refresh the session once the
 * webhook has linked the account.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const user = await db
    .select({
      line_linked_at: users.line_linked_at,
      line_trial_expires_at: users.line_trial_expires_at,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  return NextResponse.json({
    linkedAt: user?.line_linked_at ?? null,
    trialExpiresAt: user?.line_trial_expires_at ?? null,
  });
}
