"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

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

export default function RecentActivity({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <History className="h-5 w-5 text-muted-foreground" />
        ประวัติล่าสุด
      </h2>
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {sessions.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i < sessions.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl w-8 text-center flex-shrink-0">
                  {s.subject_icon ?? "📝"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        s.mode === "mock"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-brand/10 text-brand"
                      }`}
                    >
                      {s.mode === "mock" ? "สอบจำลอง" : "ฝึกทำ"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {s.subject_name_th ?? "ทุกวิชา"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatRelativeDate(s.completed_at ?? s.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold">
                  {s.correct_count}/{s.total_questions}
                </p>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    s.pct >= 60
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.pct}%
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
