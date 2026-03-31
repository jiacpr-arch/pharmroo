"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface SubjectBreakdown {
  subject_id: string;
  name_th: string;
  icon: string;
  total: number;
  correct: number;
  accuracy_pct: number;
}

export default function WeakAreas({ weakAreas }: { weakAreas: SubjectBreakdown[] }) {
  if (weakAreas.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/60 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <h2 className="font-bold text-amber-900">วิชาที่ควรเน้น</h2>
          <span className="ml-auto text-xs text-amber-700 font-medium">ต่ำกว่า 60%</span>
        </div>
        <div className="space-y-2.5">
          {weakAreas.map((s) => (
            <div
              key={s.subject_id}
              className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5 border border-amber-100"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{s.icon}</span>
                <div>
                  <p className="text-sm font-medium leading-tight">{s.name_th}</p>
                  <p className="text-xs text-red-600 font-semibold">{s.accuracy_pct}% ถูกต้อง</p>
                </div>
              </div>
              <Link href={`/ple/practice?subject=${s.subject_id}`}>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1"
                >
                  ฝึกเลย <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
