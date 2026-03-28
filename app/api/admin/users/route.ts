import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      membership_type: users.membership_type,
      membership_expires_at: users.membership_expires_at,
      created_at: users.created_at,
    })
    .from(users)
    .orderBy(desc(users.created_at));

  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, membership_type, membership_expires_at, role } = await req.json();

  await db
    .update(users)
    .set({
      membership_type,
      membership_expires_at: membership_expires_at
        ? new Date(membership_expires_at).toISOString()
        : null,
      role,
    })
    .where(eq(users.id, userId));

  return NextResponse.json({ success: true });
}
