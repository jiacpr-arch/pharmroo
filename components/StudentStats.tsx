"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Target, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface OverallStats {
  total_attempts: number;
  correct_count: number;
  accuracy_pct: number;
  total_time_seconds: number;
  total_sessions: number;
}

interface SubjectBreakdown {
  subject_id: string;
  name_th: string;
  icon: string;
  total: number;
  correct: number;
  accuracy_pct: number;
}

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

interface StatsData {
  overall: OverallStats;
  subjects: SubjectBreakdown[];
  weakAreas: SubjectBreakdown[];
  recentSessions: RecentSession[];
}

export default function StudentStats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mcq/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        กำลังโหลดสถิติ...
      </div>
    );
  }

  if (!data || data.overall.total_attempts === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-bold text-lg mb-1">ยังไม่มีข้อมูล</h3>
          <p className="text-sm text-muted-foreground mb-4">
            ไปเริ่มทำข้อสอบกันเลย!
          </p>
          <Link href="/ple">
            <Button className="bg-brand hover:bg-brand-light text-white">
              ทำข้อสอบ PLE
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const { overall, subjects, weakAreas, recentSessions } = data;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} วินาที`;
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m} นาที`;
    const h = Math.floor(m / 60);
    return `${h} ชม. ${m % 60} นาที`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-brand mx-auto mb-1" />
            <p className="text-2xl font-bold">{overall.total_attempts}</p>
            <p className="text-xs text-muted-foreground">ข้อที่ทำ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">
              <span className={overall.accuracy_pct >= 60 ? "text-green-600" : "text-red-600"}>
                {overall.accuracy_pct}%
              </span>
            </p>
            <p className="text-xs text-muted-foreground">ถูกต้อง</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold">{overall.total_sessions}</p>
            <p className="text-xs text-muted-foreground">ครั้งที่สอบ</p>
          </CardContent>
        </Card>
      </div>

      {/* Weak Areas Alert */}
      {weakAreas.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <h3 className="font-bold text-amber-800">หมวดที่ควรเน้น</h3>
            </div>
            <div className="space-y-2">
              {weakAreas.map((s) => (
                <div key={s.subject_id} className="flex items-center justify-between">
                  <span className="text-sm">
                    {s.icon} {s.name_th}
                    <span className="text-red-600 ml-2 font-medium">{s.accuracy_pct}%</span>
                  </span>
                  <Link href={`/ple/practice?subject=${s.subject_id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      ฝึกเพิ่ม
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-3">คะแนนแยกตามวิชา</h3>
          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.subject_id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {s.icon} {s.name_th}
                  </span>
                  <span className="font-medium">
                    {s.correct}/{s.total}{" "}
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ml-1 ${
                        s.accuracy_pct >= 60
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.accuracy_pct}%
                    </Badge>
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      s.accuracy_pct >= 60 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${s.accuracy_pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-3">ประวัติล่าสุด</h3>
            <div className="space-y-2">
              {recentSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        s.mode === "mock"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {s.mode === "mock" ? "สอบจำลอง" : "ฝึกทำ"}
                    </Badge>
                    <span className="text-muted-foreground">
                      {s.subject_icon} {s.subject_name_th ?? "ทุกวิชา"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {s.correct_count}/{s.total_questions}
                    </span>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
