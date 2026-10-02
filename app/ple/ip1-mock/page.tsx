import Link from "next/link";
import { ArrowLeft, Clock, Lock } from "lucide-react";
import type { Metadata } from "next";
import { IP1_MOCK_SETS, IP1_MOCK_PLANNED_SETS } from "@/lib/ip1-mock/sets";

export const metadata: Metadata = {
  title: "จำลองสอบ IP1 — เลือกชุดข้อสอบ",
  description: "ชุดจำลองสอบ PLE-IP1 เภสัชกรรมอุตสาหการ ชุดละ 120 ข้อ 12 หมวด จับเวลา พร้อมคะแนนแยกหมวด ข้อสอบแต่ละชุดไม่ซ้ำกัน",
};

const LEVEL_TH = { easy: "ง่าย", medium: "ปานกลาง", hard: "ยาก" } as const;

export default function Ip1MockIndexPage() {
  const sets = Array.from({ length: IP1_MOCK_PLANNED_SETS }, (_, i) => String(i + 1));
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/ple/practice?track=ip1" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> กลับ IP1
      </Link>
      <h1 className="text-2xl font-bold">จำลองสอบ IP1 เภสัชกรรมอุตสาหการ</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        ชุดละ 120 ข้อ ครอบคลุม 12 หมวด หมวดละ 10 ข้อ · จับเวลา 120 นาที · เฉลยละเอียดและคะแนนแยกหมวดตอนจบ · ข้อสอบในแต่ละชุดไม่ซ้ำกัน
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sets.map((no) => {
          const qs = IP1_MOCK_SETS[no];
          if (!qs) {
            return (
              <div key={no} className="rounded-2xl border border-dashed p-5 text-muted-foreground">
                <div className="flex items-center gap-2 text-lg font-semibold"><Lock className="h-5 w-5" /> Mock Set {no}</div>
                <p className="mt-2 text-sm">กำลังจัดทำ — เร็วๆ นี้</p>
              </div>
            );
          }
          const count = { easy: 0, medium: 0, hard: 0 };
          for (const q of qs) count[q.difficulty]++;
          return (
            <Link key={no} href={`/ple/ip1-mock/${no}`} className="block rounded-2xl border border-amber-200 bg-amber-50/40 p-5 transition hover:bg-amber-50">
              <div className="text-lg font-semibold">Mock Set {no}</div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> {qs.length} ข้อ · {qs.length} นาที</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {(Object.keys(count) as (keyof typeof count)[]).map((k) => `${LEVEL_TH[k]} ${count[k]}`).join(" · ")}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-amber-600">เริ่มสอบ →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
