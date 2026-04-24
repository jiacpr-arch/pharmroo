import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, desc } from "drizzle-orm";

function authorized(role: string | undefined) {
  return role === "nursing_admin" || role === "admin";
}

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !authorized(role)) {
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
      target_exam: users.target_exam,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.target_exam, "NLE"))
    .orderBy(desc(users.created_at));

  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !authorized(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, membership_type, membership_expires_at } = await req.json();

  // Scope guard: nursing_admin can only edit users whose target_exam = NLE
  // and must never touch role / admin users.
  const target = await db
    .select({ role: users.role, target_exam: users.target_exam })
    .from(users)
    .where(eq(users.id, userId))
    .then((r) => r[0]);

  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (target.target_exam !== "NLE") {
    return NextResponse.json({ error: "Out of scope" }, { status: 403 });
  }
  if (target.role === "admin" || target.role === "nursing_admin") {
    return NextResponse.json({ error: "Cannot modify admin users" }, { status: 403 });
  }

  await db
    .update(users)
    .set({
      membership_type,
      membership_expires_at: membership_expires_at
        ? new Date(membership_expires_at).toISOString()
        : null,
    })
    .where(and(eq(users.id, userId), eq(users.target_exam, "NLE")));

  return NextResponse.json({ success: true });
}
