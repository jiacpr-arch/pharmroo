import { Suspense } from "react";
import { getQuestionSets } from "@/lib/db/queries-mcq";
import { auth } from "@/lib/auth";
import type { QuestionSet } from "@/lib/types-mcq";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ชุดข้อสอบ PLE — PharmRoo",
  description:
    "ซื้อชุดข้อสอบ PLE แบบครั้งเดียว ใช้ได้ตลอด ไม่มีวันหมดอายุ",
};

const EXAM_TYPE_LABEL: Record<string, string> = {
  "PLE-CC1": "PLE-CC1",
  "PLE-PC1": "PLE-PC1 บริบาล",
  "PLE-IP1": "PLE-IP1 อุตสาหการ",
  "PLE-PHCP1": "PLE-PHCP1 คุ้มครองฯ",
  mixed: "คละทุกประเภท",
};

async function SetsContent() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const sets = await getQuestionSets(userId);

  const bundles = sets.filter((s) => s.is_bundle);
  const singles = sets.filter((s) => !s.is_bundle);

  return (
    <div className="space-y-10">
      {/* Value proposition */}
      <div className="rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="font-bold text-lg text-teal-900 mb-1">
              ซื้อครั้งเดียว ใช้ได้ตลอด
            </h2>
            <p className="text-sm text-teal-700">
              ไม่ต้องสมัครสมาชิกรายเดือน — จ่ายครั้งเดียว เข้าถึงข้อสอบในชุดได้ไม่จำกัด
            </p>
          </div>
          <div className="flex gap-4 text-sm text-teal-800">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              ไม่มีวันหมดอายุ
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              เฉลยละเอียด
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              ทำซ้ำได้
            </div>
          </div>
        </div>
      </div>

      {/* Bundle sets */}
      {bundles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-brand" />
            <h2 className="font-bold text-lg">ชุดรวม (Bundle)</h2>
            <Badge className="bg-amber-100 text-amber-700">ประหยัดสุด</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bundles.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        </div>
      )}

      {/* Individual sets */}
      {singles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand" />
            <h2 className="font-bold text-lg">ชุดข้อสอบรายชุด</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {singles.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        </div>
      )}

      {sets.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>กำลังเตรียมชุดข้อสอบ — เร็วๆ นี้</p>
        </div>
      )}

      {/* Compare with subscription */}
      <div className="border rounded-xl p-6 bg-muted/30 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          เปรียบเทียบกับ Subscription
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-brand">ชุดข้อสอบ (One-time)</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>✅ ซื้อครั้งเดียว ใช้ได้ตลอด</li>
              <li>✅ เหมาะสำหรับเตรียมสอบระยะสั้น</li>
              <li>✅ เลือกเฉพาะชุดที่ต้องการ</li>
              <li>❌ เข้าถึงได้เฉพาะชุดที่ซื้อ</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Subscription รายเดือน/ปี</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>✅ เข้าถึงทุกชุด ทุกหมวด</li>
              <li>✅ ข้อสอบใหม่อัปเดตตลอด</li>
              <li>✅ เหมาะสำหรับเตรียมสอบระยะยาว</li>
              <li>❌ ต้องต่ออายุ</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/pricing">
            <Button variant="outline" size="sm">ดูแผน Subscription</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SetCard({ set }: { set: QuestionSet }) {
  const examLabel = set.exam_type ? EXAM_TYPE_LABEL[set.exam_type] : "";
  const dayLabel = set.exam_day ? ` · Day ${set.exam_day}` : "";

  return (
    <Card
      className={`relative transition-all hover:shadow-md ${
        set.is_bundle ? "border-amber-200 bg-amber-50/30" : ""
      }`}
    >
      {set.is_bundle && (
        <div className="absolute -top-2 left-4">
          <Badge className="bg-amber-500 text-white text-xs">Bundle</Badge>
        </div>
      )}
      {set.user_purchased && (
        <div className="absolute -top-2 right-4">
          <Badge className="bg-green-500 text-white text-xs gap-1">
            <CheckCircle className="h-3 w-3" /> ซื้อแล้ว
          </Badge>
        </div>
      )}
      <CardHeader className="pb-2 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold">{set.name_th}</h3>
            <div className="flex gap-1 mt-1 flex-wrap">
              {examLabel && (
                <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-700">
                  {examLabel}{dayLabel}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {set.question_count} ข้อ
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0">
            {set.original_price && (
              <p className="text-xs text-muted-foreground line-through">
                ฿{set.original_price.toLocaleString()}
              </p>
            )}
            <p className="text-xl font-bold text-brand">
              ฿{set.price.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {set.description && (
          <p className="text-sm text-muted-foreground">{set.description}</p>
        )}
        {set.user_purchased ? (
          <Link href={`/ple/practice?set=${set.id}`}>
            <Button className="w-full bg-brand hover:bg-brand-light text-white" size="sm">
              <BookOpen className="h-4 w-4 mr-2" /> เริ่มทำข้อสอบ
            </Button>
          </Link>
        ) : (
          <Link href={`/sets/${set.id}`}>
            <Button className="w-full bg-brand hover:bg-brand-light text-white" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" /> ดูรายละเอียด / ซื้อ
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export default function SetsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ชุดข้อสอบ PLE</h1>
        <p className="text-muted-foreground mt-2">
          ซื้อครั้งเดียว เข้าถึงได้ตลอด — ถูกกว่าคอร์สติว 10 เท่า
        </p>
      </div>
      <Suspense
        fallback={<div className="text-center py-8">กำลังโหลด...</div>}
      >
        <SetsContent />
      </Suspense>
    </div>
  );
}
