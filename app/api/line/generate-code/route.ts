import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { lineLinkCodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Generate a LINE OA link code.
 * User copies this code → sends to LINE OA chat → links account.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  // Delete existing codes for this user
  await db
    .delete(lineLinkCodes)
    .where(eq(lineLinkCodes.user_id, session.user.id));

  // Generate code: PHARMROO-XXXXXX
  const suffix = randomUUID().slice(0, 6).toUpperCase();
  const code = `PHARMROO-${suffix}`;

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await db.insert(lineLinkCodes).values({
    user_id: session.user.id,
    code,
    expires_at: expiresAt.toISOString(),
  });

  return NextResponse.json({ code, expiresAt: expiresAt.toISOString() });
}
