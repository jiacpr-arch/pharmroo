"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SubjectBreakdown {
  subject_id: string;
  name_th: string;
  icon: string;
  total: number;
  correct: number;
  accuracy_pct: number;
}

function AccuracyBar({ pct }: { pct: number }) {
  const color =
    pct >= 75 ? "bg-green-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full bg-muted rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function AccuracyBadge({ pct }: { pct: number }) {
  const cls =
    pct >= 75
      ? "bg-green-100 text-green-700"
      : pct >= 60
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";
  return (
    <Badge variant="secondary" className={`text-[10px] font-semibold ${cls}`}>
      {pct}%
    </Badge>
  );
}

export default function SubjectProgress({
  subjects,
}: {
  subjects: SubjectBreakdown[];
}) {
  if (subjects.length === 0) return null;

  const sorted = [...subjects].sort((a, b) => b.total - a.total);

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">ความก้าวหน้าแยกวิชา</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map((s) => (
          <Card key={s.subject_id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm font-medium leading-tight">{s.name_th}</span>
                </div>
                <AccuracyBadge pct={s.accuracy_pct} />
              </div>
              <AccuracyBar pct={s.accuracy_pct} />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  ทำแล้ว {s.correct}/{s.total} ข้อ
                </p>
                <Link href={`/ple/practice?subject=${s.subject_id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-brand hover:text-brand px-2"
                  >
                    ฝึกเพิ่ม <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
