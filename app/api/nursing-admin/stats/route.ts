import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, mcqQuestions, mcqSubjects } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || (role !== "nursing_admin" && role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalQuestions, totalSubjects, totalNursingUsers] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(mcqQuestions)
      .where(eq(mcqQuestions.exam_type, "NLE"))
      .then((rows) => rows[0]),
    db
      .select({ count: sql<number>`count(*)` })
      .from(mcqSubjects)
      .where(eq(mcqSubjects.exam_type, "NLE"))
      .then((rows) => rows[0]),
    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.exam_category, "nursing"))
      .then((rows) => rows[0]),
  ]);

  return NextResponse.json({
    totalQuestions: totalQuestions?.count ?? 0,
    totalSubjects: totalSubjects?.count ?? 0,
    totalNursingUsers: totalNursingUsers?.count ?? 0,
  });
}
