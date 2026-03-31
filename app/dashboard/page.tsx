"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  BarChart3,
  ArrowRight,
  Flame,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/mcq/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const overall = data?.overall;
  const totalAttempts = overall?.total_attempts ?? 0;
  const subjects = data?.subjects ?? [];
  const weakAreas = data?.weakAreas ?? [];
  const recentSessions = data?.recentSessions ?? [];

  if (totalAttempts === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">ยังไม่มีข้อมูลการเรียน</h1>
        <p className="text-muted-foreground mb-6">
          เริ่มทำข้อสอบเพื่อดูสถิติและจุดอ่อนของคุณ
        </p>
        <Link href="/ple/practice">
          <Button className="bg-brand hover:bg-brand-light text-white">
            เริ่มทำข้อสอบ
          </Button>
        </Link>
      </div>
    );
  }

  const bestSubject = [...subjects].sort((a, b) => b.accuracy_pct - a.accuracy_pct)[0];
  const avgTimeSec =
    totalAttempts > 0 ? Math.round((overall?.total_time_seconds ?? 0) / totalAttempts) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ผลการเรียน</h1>
        <p className="text-muted-foreground mt-1">
          ติดตามความก้าวหน้าและจุดที่ต้องปรับปรุง
        </p>
      </div>

      {/* ── Summary Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAttempts}</p>
                <p className="text-xs text-muted-foreground">ข้อที่ทำแล้ว</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overall?.accuracy_pct ?? 0}%</p>
                <p className="text-xs text-muted-foreground">ถูกต้องรวม</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overall?.total_sessions ?? 0}</p>
                <p className="text-xs text-muted-foreground">ครั้งที่สอบ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold truncate">
                  {bestSubject ? `${bestSubject.icon} ${bestSubject.accuracy_pct}%` : "—"}
                </p>
                <p className="text-xs text-muted-foreground">เก่งที่สุด</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgTimeSec}s</p>
                <p className="text-xs text-muted-foreground">เวลาเฉลี่ย/ข้อ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Weak Topics ───────────────────────────────────────────────── */}
      {weakAreas.length > 0 && (
        <Card className="border-red-200 bg-red-50/50 mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              ควรทบทวน — สาขาที่ถูกต้อง &lt; 60%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weakAreas.map((topic) => (
                <div
                  key={topic.subject_id}
                  className="flex items-center justify-between rounded-lg bg-white p-3 border border-red-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{topic.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{topic.name_th}</p>
                      <p className="text-xs text-red-600">
                        {topic.accuracy_pct}% ({topic.total - topic.correct} ข้อผิด)
                      </p>
                    </div>
                  </div>
                  <Link href={`/ple/practice?subject=${topic.subject_id}`}>
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      ฝึกเพิ่ม <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Subject Performance Table ──────────────────────────────────── */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">สถิติแยกตามสาขา</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...subjects].sort((a, b) => b.accuracy_pct - a.accuracy_pct).map((stat) => {
              const color =
                stat.accuracy_pct >= 80
                  ? "text-green-600"
                  : stat.accuracy_pct >= 60
                  ? "text-yellow-600"
                  : "text-red-600";
              const bgColor =
                stat.accuracy_pct >= 80
                  ? "bg-green-500"
                  : stat.accuracy_pct >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500";
              return (
                <div
                  key={stat.subject_id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <span className="text-xl w-8 text-center">{stat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{stat.name_th}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-sm font-bold ${color}`}>
                          {stat.accuracy_pct}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({stat.correct}/{stat.total})
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${bgColor}`}
                        style={{ width: `${Math.min(stat.accuracy_pct, 100)}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/ple/practice?subject=${stat.subject_id}`}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Recent Sessions ───────────────────────────────────────────── */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">เซสชันล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{session.subject_icon || "📝"}</span>
                    <div>
                      <p className="text-sm font-medium">
                        {session.subject_name_th || "ทุกสาขา"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={session.mode === "mock" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {session.mode === "mock" ? "Mock" : "Practice"}
                    </Badge>
                    <span
                      className={`text-sm font-bold ${
                        session.pct >= 60 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {session.correct_count}/{session.total_questions} ({session.pct}%)
                    </span>
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
