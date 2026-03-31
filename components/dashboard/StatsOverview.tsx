"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Clock, BookOpen } from "lucide-react";

interface OverallStats {
  total_attempts: number;
  correct_count: number;
  accuracy_pct: number;
  total_time_seconds: number;
  total_sessions: number;
}

function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds} วิ`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} นาที`;
  const h = Math.floor(m / 60);
  return `${h} ชม. ${m % 60} นาที`;
}

function getAccuracyColor(pct: number) {
  if (pct >= 75) return "text-green-600";
  if (pct >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function StatsOverview({ overall }: { overall: OverallStats }) {
  const stats = [
    {
      icon: Target,
      iconColor: "text-brand",
      bgColor: "bg-brand/10",
      value: overall.total_attempts.toLocaleString(),
      label: "ข้อที่ทำทั้งหมด",
    },
    {
      icon: TrendingUp,
      iconColor: getAccuracyColor(overall.accuracy_pct),
      bgColor:
        overall.accuracy_pct >= 60
          ? "bg-green-50"
          : "bg-red-50",
      value: `${overall.accuracy_pct}%`,
      valueClass: getAccuracyColor(overall.accuracy_pct),
      label: "ความถูกต้อง",
    },
    {
      icon: BookOpen,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      value: overall.total_sessions.toLocaleString(),
      label: "ครั้งที่สอบ",
    },
    {
      icon: Clock,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      value: formatTime(overall.total_time_seconds),
      label: "เวลาทั้งหมด",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${s.bgColor} flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-2xl font-bold leading-tight ${s.valueClass ?? ""}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
