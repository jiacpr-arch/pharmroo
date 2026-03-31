"use client";

import { Card, CardContent } from "@/components/ui/card";
import { History, CheckCircle2, XCircle } from "lucide-react";

interface RecentSession {
  id: string;
  mode: string;
  exam_type: string;
  total_questions: number;
  correct_count: number;
  pct: number;
  completed_at: string | null;
  created_at: string;
  subject_name_th: string | null;
  subject_icon: string | null;
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "วันนี้";
  if (diffDays === 1) return "เมื่อวาน";
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}

const modeStyle: Record<string, { label: string; bg: string; text: string }> = {
  mock: { label: "สอบจำลอง", bg: "bg-purple-100", text: "text-purple-700" },
  practice: { label: "ฝึกทำ", bg: "bg-teal-100", text: "text-teal-700" },
};

export default function RecentActivity({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) return null;

  return (
    <div>
      <h2 className="text-base font-semibold text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
        <History className="h-4 w-4" />
        ประวัติล่าสุด
      </h2>
      <Card className="border-none shadow-sm divide-y">
        {sessions.map((s) => {
          const passed = s.pct >= 60;
          const mode = modeStyle[s.mode] ?? { label: s.mode, bg: "bg-gray-100", text: "text-gray-600" };
          return (
            <CardContent key={s.id} className="px-5 py-3.5 flex items-center gap-3">
              {/* icon */}
              <div className="text-2xl w-10 h-10 flex items-center justify-center bg-muted rounded-xl flex-shrink-0">
                {s.subject_icon ?? "📝"}
              </div>

              {/* info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mode.bg} ${mode.text}`}>
                    {mode.label}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {s.subject_name_th ?? "ทุกวิชา"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatRelativeDate(s.completed_at ?? s.created_at)}
                </p>
              </div>

              {/* score */}
              <div className="text-right flex-shrink-0 flex items-center gap-2">
                {passed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <div>
                  <p className="text-sm font-bold leading-tight">
                    {s.correct_count}/{s.total_questions}
                  </p>
                  <p className={`text-xs font-semibold ${passed ? "text-green-600" : "text-red-500"}`}>
                    {s.pct}%
                  </p>
                </div>
              </div>
            </CardContent>
          );
        })}
      </Card>
    </div>
  );
}
