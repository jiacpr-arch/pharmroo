import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, mcqQuestions, paymentOrders } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalQuestions, totalUsers, pendingPayments, byCategory] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(mcqQuestions).then(rows => rows[0]),
    db.select({ count: sql<number>`count(*)` }).from(users).then(rows => rows[0]),
    db
      .select({ count: sql<number>`count(*)` })
      .from(paymentOrders)
      .where(eq(paymentOrders.status, "pending"))
      .then(rows => rows[0]),
    db
      .select({
        category: users.exam_category,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .groupBy(users.exam_category),
  ]);

  const usersByCategory = { pharmacy: 0, nursing: 0, uncategorized: 0 };
  for (const row of byCategory) {
    if (row.category === "pharmacy") usersByCategory.pharmacy = Number(row.count);
    else if (row.category === "nursing") usersByCategory.nursing = Number(row.count);
    else usersByCategory.uncategorized = Number(row.count);
  }

  return NextResponse.json({
    totalExams: totalQuestions?.count ?? 0,
    totalUsers: totalUsers?.count ?? 0,
    pendingPayments: pendingPayments?.count ?? 0,
    usersByCategory,
  });
}
