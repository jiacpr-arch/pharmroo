"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sparkles, Target, TrendingUp, BookOpen, Clock } from "lucide-react";
import QuickActions from "@/components/dashboard/QuickActions";
import SubjectProgress from "@/components/dashboard/SubjectProgress";
import WeakAreas from "@/components/dashboard/WeakAreas";
import RecentActivity from "@/components/dashboard/RecentActivity";

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

const membershipLabels: Record<string, string> = {
  free: "ฟรี",
  monthly: "รายเดือน",
  yearly: "รายปี",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "อรุณสวัสดิ์";
  if (hour < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

function formatTime(seconds: number) {
  if (seconds < 60) return `${seconds} วิ`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} นาที`;
  const h = Math.floor(m / 60);
  return `${h} ชม. ${m % 60} นาที`;
}

function HeroBanner({
  userName,
  membershipType,
  membershipExpiresAt,
  overall,
}: {
  userName: string;
  membershipType: string;
  membershipExpiresAt?: string | null;
  overall?: OverallStats;
}) {
  const isYearly = membershipType === "yearly";
  const isMonthly = membershipType === "monthly";
  const isPaid = isYearly || isMonthly;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D9488] via-[#0f766e] to-[#134E4A] text-white px-6 py-8 sm:px-8">
      {/* decorative circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
      <div className="absolute top-4 right-24 w-20 h-20 rounded-full bg-white/5" />

      <div className="relative">
        {/* top row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-teal-200 text-sm font-medium">{getGreeting()} 👋</p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-0.5">{userName}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Crown className="h-4 w-4 text-amber-300" />
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isYearly
                    ? "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                    : isMonthly
                    ? "bg-white/20 text-white border border-white/20"
                    : "bg-white/10 text-teal-100 border border-white/10"
                }`}
              >
                {membershipLabels[membershipType] ?? membershipType}
              </span>
              {membershipExpiresAt && isPaid && (
                <span className="text-xs text-teal-200">
                  หมดอายุ{" "}
                  {new Date(membershipExpiresAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>

          {!isPaid && (
            <Link href="/pricing" className="shrink-0">
              <Button
                size="sm"
                className="bg-white text-brand hover:bg-teal-50 gap-1.5 font-semibold shadow"
              >
                <Sparkles className="h-4 w-4" />
                อัปเกรดแพ็กเกจ
              </Button>
            </Link>
          )}
        </div>

        {/* stats inline */}
        {overall && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              {
                icon: Target,
                value: overall.total_attempts.toLocaleString(),
                label: "ข้อที่ทำ",
              },
              {
                icon: TrendingUp,
                value: `${overall.accuracy_pct}%`,
                label: "ความถูกต้อง",
                highlight:
                  overall.accuracy_pct >= 75
                    ? "text-green-300"
                    : overall.accuracy_pct >= 60
                    ? "text-amber-300"
                    : "text-red-300",
              },
              {
                icon: BookOpen,
                value: overall.total_sessions.toLocaleString(),
                label: "ครั้งที่สอบ",
              },
              {
                icon: Clock,
                value: formatTime(overall.total_time_seconds),
                label: "เวลาทั้งหมด",
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                >
                  <Icon className="h-4 w-4 text-teal-200 mb-1.5" />
                  <p className={`text-xl font-bold leading-tight ${s.highlight ?? "text-white"}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-teal-200 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="py-16 text-center">
        <div className="text-5xl mb-4">💊</div>
        <h3 className="text-xl font-bold mb-2">ยังไม่มีข้อมูลการสอบ</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          เริ่มทำข้อสอบเพื่อดูสถิติและความก้าวหน้าของคุณที่นี่
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/ple/practice">
            <Button className="bg-brand hover:bg-brand-light text-white">
              ฝึกทำข้อสอบ
            </Button>
          </Link>
          <Link href="/ple/mock">
            <Button variant="outline">สอบจำลอง PLE</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/mcq/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="text-center space-y-3">
          <div className="text-3xl animate-bounce">💊</div>
          <p className="text-muted-foreground">กำลังโหลด Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as {
    name?: string;
    email?: string;
    role?: string;
    membership_type?: string;
    membership_expires_at?: string | null;
  };

  const membershipType = user.membership_type ?? "free";
  const hasData = stats && stats.overall.total_attempts > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Hero Banner with inline stats */}
        <HeroBanner
          userName={user.name ?? "นักเรียน"}
          membershipType={membershipType}
          membershipExpiresAt={user.membership_expires_at}
          overall={hasData ? stats.overall : undefined}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Content — only when data exists */}
        {hasData ? (
          <>
            {stats.weakAreas.length > 0 && (
              <WeakAreas weakAreas={stats.weakAreas} />
            )}

            {stats.subjects.length > 0 && (
              <SubjectProgress subjects={stats.subjects} />
            )}

            {stats.recentSessions.length > 0 && (
              <RecentActivity sessions={stats.recentSessions} />
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
