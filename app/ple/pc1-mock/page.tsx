import Link from "next/link";
import { ArrowLeft, Clock, Lock } from "lucide-react";
import type { Metadata } from "next";
import { PC1_MOCK_SETS, PC1_MOCK_PLANNED_SETS } from "@/lib/pc1-mock-sets";

export const metadata: Metadata = {
  title: "จำลองสอบ PC1 — เลือกชุดข้อสอบ",
  description: "ชุดจำลองสอบ PLE-PC1 บริบาลเภสัชกรรม ชุดละ 120 ข้อ 12 หมวด จับเวลา พร้อมคะแนนแยกหมวด",
};

const LEVEL_TH = { easy: "ง่าย", medium: "ปานกลาง", hard: "ยาก" } as const;

export default function Pc1MockIndexPage() {
  const sets = Array.from({ length: PC1_MOCK_PLANNED_SETS }, (_, i) => String(i + 1));
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/ple/pc1-pilot" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand">
        <ArrowLeft className="h-4 w-4" /> กลับ PC1
      </Link>
      <h1 className="text-2xl font-bold">จำลองสอบ PC1 บริบาลเภสัชกรรม</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        ชุดละ 120 ข้อ ครอบคลุม 12 หมวดโรค หมวดละ 10 ข้อ · จับเวลา 120 นาที · เฉลยละเอียดและคะแนนแยกหมวดตอนจบ · ข้อสอบในแต่ละชุดไม่ซ้ำกัน
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sets.map((no) => {
          const qs = PC1_MOCK_SETS[no];
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
            <Link key={no} href={`/ple/pc1-mock/${no}`} className="block rounded-2xl border border-rose-200 bg-rose-50/40 p-5 transition hover:bg-rose-50">
              <div className="text-lg font-semibold">Mock Set {no}</div>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" /> {qs.length} ข้อ · {qs.length} นาที</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {(Object.keys(count) as (keyof typeof count)[]).map((k) => `${LEVEL_TH[k]} ${count[k]}`).join(" · ")}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-rose-600">เริ่มสอบ →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
