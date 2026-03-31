"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface SubjectBreakdown {
  subject_id: string;
  name_th: string;
  icon: string;
  total: number;
  correct: number;
  accuracy_pct: number;
}

function getAccuracyStyle(pct: number) {
  if (pct >= 75) return { bar: "bg-green-500", badge: "bg-green-100 text-green-700", ring: "ring-green-200" };
  if (pct >= 60) return { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700", ring: "ring-amber-200" };
  return { bar: "bg-red-500", badge: "bg-red-100 text-red-700", ring: "ring-red-200" };
}

export default function SubjectProgress({ subjects }: { subjects: SubjectBreakdown[] }) {
  if (subjects.length === 0) return null;

  const sorted = [...subjects].sort((a, b) => b.total - a.total);

  return (
    <div>
      <h2 className="text-base font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        ความก้าวหน้าแต่ละวิชา
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((s) => {
          const style = getAccuracyStyle(s.accuracy_pct);
          return (
            <Card
              key={s.subject_id}
              className={`border-none shadow-sm hover:shadow-md transition-shadow ring-1 ${style.ring}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-muted rounded-xl flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate">{s.name_th}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ทำแล้ว {s.correct}/{s.total} ข้อ
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${style.badge}`}
                  >
                    {s.accuracy_pct}%
                  </span>
                </div>

                {/* progress bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${style.bar}`}
                    style={{ width: `${s.accuracy_pct}%` }}
                  />
                </div>

                <Link
                  href={`/ple/practice?subject=${s.subject_id}`}
                  className="flex items-center gap-0.5 text-xs text-brand font-medium hover:underline"
                >
                  ฝึกเพิ่มเติม <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
