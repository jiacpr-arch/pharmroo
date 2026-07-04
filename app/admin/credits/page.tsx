import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  creditLedger,
  creditPurchases,
  paymentOrders,
  users,
} from "@/lib/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

/**
 * Credit-ledger summary for monthly bookkeeping: credits are prepaid revenue,
 * so the outstanding balance is a liability until spent.
 */
export default async function CreditsDashboardPage() {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user as { role?: string }).role !== "admin"
  ) {
    redirect("/login");
  }

  const [totals, outstanding, pendingCount, revenue, monthly, recent] =
    await Promise.all([
      // Credits in/out by ledger type (all time)
      db
        .select({
          type: creditLedger.type,
          credits: sql<number>`coalesce(sum(${creditLedger.amount}), 0)`,
          entries: sql<number>`count(*)`,
        })
        .from(creditLedger)
        .groupBy(creditLedger.type),
      // Liability: credits sitting unspent in user balances
      db
        .select({ total: sql<number>`coalesce(sum(${users.credit_balance}), 0)` })
        .from(users)
        .then((rows) => Number(rows[0]?.total ?? 0)),
      // Top-ups awaiting slip review
      db
        .select({ count: sql<number>`count(*)` })
        .from(creditPurchases)
        .where(eq(creditPurchases.status, "pending"))
        .then((rows) => Number(rows[0]?.count ?? 0)),
      // Money received from credit orders
      db
        .select({
          total: sql<number>`coalesce(sum(${paymentOrders.amount}), 0)`,
          orders: sql<number>`count(*)`,
        })
        .from(paymentOrders)
        .where(
          and(
            eq(paymentOrders.order_type, "credit"),
            eq(paymentOrders.status, "approved")
          )
        )
        .then((rows) => ({
          total: Number(rows[0]?.total ?? 0),
          orders: Number(rows[0]?.orders ?? 0),
        })),
      // Monthly purchased vs spent (last 6 months)
      db.execute(sql`
        SELECT
          substr(created_at, 1, 7) AS month,
          SUM(CASE WHEN type IN ('purchase', 'welcome', 'admin', 'refund') THEN amount ELSE 0 END)::int AS credits_in,
          SUM(CASE WHEN type = 'spend' THEN -amount ELSE 0 END)::int AS credits_spent
        FROM credit_ledger
        GROUP BY month
        ORDER BY month DESC
        LIMIT 6
      `),
      // Latest ledger activity
      db
        .select({
          created_at: creditLedger.created_at,
          type: creditLedger.type,
          amount: creditLedger.amount,
          balance_after: creditLedger.balance_after,
          note: creditLedger.note,
          email: users.email,
        })
        .from(creditLedger)
        .leftJoin(users, eq(creditLedger.user_id, users.id))
        .orderBy(desc(creditLedger.created_at))
        .limit(20),
    ]);

  const byType = Object.fromEntries(
    totals.map((t) => [t.type, Number(t.credits)])
  );
  const purchased = byType["purchase"] ?? 0;
  const welcome = byType["welcome"] ?? 0;
  const spent = -(byType["spend"] ?? 0);

  const typeLabels: Record<string, string> = {
    purchase: "ซื้อแพ็ก",
    welcome: "แจกตอนสมัคร",
    spend: "ใช้ปลดล็อก",
    refund: "คืนเครดิต",
    admin: "แอดมินปรับ",
  };

  const monthlyRows = monthly.rows as Array<{
    month: string;
    credits_in: number;
    credits_spent: number;
  }>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Credits Dashboard</h1>

        {/* Headline stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-400 mb-1">รายรับจากเครดิต</p>
            <p className="text-3xl font-bold">
              ฿{revenue.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">{revenue.orders} ออเดอร์</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-400 mb-1">เครดิตที่ขายแล้ว</p>
            <p className="text-3xl font-bold">{purchased.toLocaleString()}</p>
            <p className="text-sm text-gray-500">
              + แจกฟรี {welcome.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-400 mb-1">เครดิตที่ถูกใช้</p>
            <p className="text-3xl font-bold">{spent.toLocaleString()}</p>
            <p className="text-sm text-gray-500">ปลดล็อกเฉลยรายข้อ</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-400 mb-1">
              ค้างในระบบ (ภาระผูกพัน)
            </p>
            <p className="text-3xl font-bold">
              {outstanding.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              รอตรวจสลิป {pendingCount} รายการ
            </p>
          </div>
        </div>

        {/* Monthly breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">รายเดือน (6 เดือนล่าสุด)</h2>
          {monthlyRows.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีข้อมูล</p>
          ) : (
            <div className="space-y-3">
              {monthlyRows.map((m) => (
                <div
                  key={m.month}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium">{m.month}</span>
                  <span className="text-sm">
                    เข้า +{Number(m.credits_in).toLocaleString()} — ใช้{" "}
                    {Number(m.credits_spent).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            รายการล่าสุด (20 รายการ)
          </h2>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีรายการ</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b">
                    <th className="py-2 pr-4">เวลา</th>
                    <th className="py-2 pr-4">ผู้ใช้</th>
                    <th className="py-2 pr-4">ประเภท</th>
                    <th className="py-2 pr-4 text-right">เครดิต</th>
                    <th className="py-2 text-right">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {r.created_at}
                      </td>
                      <td className="py-2 pr-4">{r.email ?? "-"}</td>
                      <td className="py-2 pr-4">
                        {typeLabels[r.type] ?? r.type}
                      </td>
                      <td
                        className={`py-2 pr-4 text-right font-medium ${
                          r.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {r.amount > 0 ? `+${r.amount}` : r.amount}
                      </td>
                      <td className="py-2 text-right">{r.balance_after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
