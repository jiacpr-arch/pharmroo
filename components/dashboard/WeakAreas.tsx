"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Flame } from "lucide-react";

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
    <Card className="border-none shadow-sm overflow-hidden">
      {/* colored top bar */}
      <div className="h-1.5 bg-gradient-to-r from-amber-400 to-red-500" />
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-amber-100 rounded-xl">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-sm">วิชาที่ควรเน้น</h2>
            <p className="text-xs text-muted-foreground">คะแนนต่ำกว่า 60% — แนะนำให้ฝึกเพิ่ม</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {weakAreas.map((s) => (
            <div
              key={s.subject_id}
              className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{s.name_th}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-bold">{s.accuracy_pct}% ถูกต้อง</span>
                  </div>
                </div>
              </div>
              <Link href={`/ple/practice?subject=${s.subject_id}`}>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none shadow-sm"
                >
                  ฝึกเลย
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
