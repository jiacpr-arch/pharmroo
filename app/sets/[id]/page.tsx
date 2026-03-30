export const dynamic = "force-dynamic";
import { getQuestionSet } from "@/lib/db/queries-mcq";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { setPurchases } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const set = await getQuestionSet(id);
  if (!set) return { title: "ไม่พบชุดข้อสอบ" };
  return {
    title: `${set.name_th} — PharmRoo`,
    description: set.description || `ชุดข้อสอบ ${set.name_th} จำนวน ${set.question_count} ข้อ`,
  };
}

const INCLUDES = [
  "ข้อสอบ MCQ 5 ตัวเลือก",
  "เฉลยละเอียดทุกข้อ",
  "อธิบายเหตุผลทุกตัวเลือก",
  "Key takeaway สรุปประเด็นสำคัญ",
  "ทำซ้ำได้ไม่จำกัดครั้ง",
  "ไม่มีวันหมดอายุ",
];

export default async function SetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const set = await getQuestionSet(id);
  if (!set) notFound();

  // Check if user already purchased
  const session = await auth();
  const user = session?.user as { id?: string } | undefined;

  let alreadyPurchased = false;
  if (user?.id) {
    const purchase = await db
      .select({ id: setPurchases.id })
      .from(setPurchases)
      .where(and(eq(setPurchases.user_id, user.id), eq(setPurchases.set_id, id), eq(setPurchases.status, "active")))
      .then(rows => rows[0]);
    alreadyPurchased = !!purchase;
  }

  const savings =
    set.original_price && set.original_price > set.price
      ? set.original_price - set.price
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/sets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> กลับชุดข้อสอบ
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {set.exam_type && (
                <Badge className="bg-teal-100 text-teal-700">
                  {set.exam_type}
                  {set.exam_day ? ` Day ${set.exam_day}` : ""}
                </Badge>
              )}
              {set.is_bundle && (
                <Badge className="bg-amber-100 text-amber-700">
                  <Package className="h-3 w-3 mr-1" /> Bundle
                </Badge>
              )}
              <Badge variant="secondary">
                <BookOpen className="h-3 w-3 mr-1" />
                {set.question_count} ข้อ
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">{set.name_th}</h1>
            {set.description && (
              <p className="text-muted-foreground mt-2">{set.description}</p>
            )}
          </div>

          {/* What's included */}
          <Card>
            <CardContent className="pt-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand" />
                สิ่งที่ได้รับในชุดนี้
              </h2>
              <ul className="space-y-2">
                {INCLUDES.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How to use */}
          <Card>
            <CardContent className="pt-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand" />
                วิธีใช้งาน
              </h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-4">
                <li>ซื้อชุดข้อสอบโดยโอนเงินตามข้อมูลที่แสดง</li>
                <li>แนบสลิปและรอการยืนยัน (ภายใน 1-2 ชั่วโมง)</li>
                <li>เข้าถึงชุดข้อสอบได้จากหน้า "ชุดข้อสอบของฉัน"</li>
                <li>ทำซ้ำได้ไม่จำกัด ไม่มีวันหมดอายุ</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Purchase card */}
        <div className="space-y-4">
          <Card className="sticky top-6 border-brand/20">
            <CardContent className="pt-5 space-y-4">
              <div className="text-center">
                {set.original_price && (
                  <p className="text-sm text-muted-foreground line-through">
                    ฿{set.original_price.toLocaleString()}
                  </p>
                )}
                <p className="text-4xl font-bold text-brand">
                  ฿{set.price.toLocaleString()}
                </p>
                {savings && (
                  <Badge className="bg-red-100 text-red-700 mt-1">
                    ประหยัด ฿{savings.toLocaleString()}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  ซื้อครั้งเดียว ใช้ได้ตลอด
                </p>
              </div>

              {alreadyPurchased ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium py-2">
                    <CheckCircle className="h-4 w-4" /> ซื้อแล้ว
                  </div>
                  <Link href={`/ple/practice?set=${id}`}>
                    <Button className="w-full bg-brand hover:bg-brand-light text-white">
                      <BookOpen className="h-4 w-4 mr-2" /> เริ่มทำข้อสอบ
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href={user ? `/payment/set/${id}` : `/login?redirect=/sets/${id}`}>
                  <Button className="w-full bg-brand hover:bg-brand-light text-white" size="lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {user ? "ซื้อชุดนี้" : "เข้าสู่ระบบเพื่อซื้อ"}
                  </Button>
                </Link>
              )}

              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  ชำระผ่านการโอนเงิน
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  ยืนยันภายใน 1-2 ชั่วโมง
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  ไม่มีวันหมดอายุ
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Compare subscription */}
          <div className="text-center text-sm text-muted-foreground">
            หรือ{" "}
            <Link href="/pricing" className="text-brand hover:underline">
              สมัคร Subscription
            </Link>{" "}
            เข้าถึงทุกชุด ฿249/เดือน
          </div>
        </div>
      </div>
    </div>
  );
}
