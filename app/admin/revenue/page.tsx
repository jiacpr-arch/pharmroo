import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { paymentOrders, users } from "@/lib/db/schema";
import { eq, gte, sql } from "drizzle-orm";

export default async function RevenueDashboardPage() {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user as { role?: string }).role !== "admin"
  ) {
    redirect("/login");
  }

  const now = new Date();
  const periods = {
    "7d": new Date(now.getTime() - 7 * 86400000).toISOString(),
    "30d": new Date(now.getTime() - 30 * 86400000).toISOString(),
    "90d": new Date(now.getTime() - 90 * 86400000).toISOString(),
  };

  // Fetch revenue stats for each period
  const stats = await Promise.all(
    Object.entries(periods).map(async ([label, since]) => {
      const result = await db
        .select({
          totalRevenue: sql<number>`coalesce(sum(${paymentOrders.amount}), 0)`,
          orderCount: sql<number>`count(*)`,
        })
        .from(paymentOrders)
        .where(
          sql`${paymentOrders.status} = 'approved' AND ${paymentOrders.created_at} >= ${since}`
        )
        .then((rows) => rows[0]);

      return {
        label,
        totalRevenue: Number(result?.totalRevenue ?? 0),
        orderCount: Number(result?.orderCount ?? 0),
      };
    })
  );

  // Plan breakdown (all time approved)
  const planBreakdown = await db
    .select({
      planType: paymentOrders.plan_type,
      count: sql<number>`count(*)`,
      total: sql<number>`coalesce(sum(${paymentOrders.amount}), 0)`,
    })
    .from(paymentOrders)
    .where(eq(paymentOrders.status, "approved"))
    .groupBy(paymentOrders.plan_type);

  // Total members
  const memberCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(sql`${users.membership_type} != 'free'`)
    .then((rows) => Number(rows[0]?.count ?? 0));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Revenue Dashboard</h1>

        {/* Period Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-400 mb-1">
                ช่วง {s.label}
              </p>
              <p className="text-3xl font-bold">
                ฿{s.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {s.orderCount} ออเดอร์
              </p>
            </div>
          ))}
        </div>

        {/* Plan Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">แยกตามแพ็กเกจ</h2>
          <div className="space-y-3">
            {planBreakdown.map((p) => (
              <div
                key={p.planType ?? "other"}
                className="flex items-center justify-between"
              >
                <span className="font-medium">
                  {p.planType ?? "อื่นๆ"}
                </span>
                <span>
                  {Number(p.count)} ออเดอร์ — ฿
                  {Number(p.total).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Member Count */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-400 mb-1">สมาชิกที่ active</p>
          <p className="text-3xl font-bold">{memberCount} คน</p>
        </div>
      </div>
    </div>
  );
}
