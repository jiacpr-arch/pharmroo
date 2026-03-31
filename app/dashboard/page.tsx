"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sparkles } from "lucide-react";
import StatsOverview from "@/components/dashboard/StatsOverview";
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

const membershipBadgeClass: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  monthly: "bg-brand/10 text-brand",
  yearly: "bg-amber-100 text-amber-700",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "อรุณสวัสดิ์";
  if (hour < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()} 👋</p>
          <h1 className="text-3xl font-bold text-foreground">
            {user.name ?? "นักเรียน"}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <Crown className="h-4 w-4 text-brand" />
            <Badge
              className={`text-xs ${
                membershipBadgeClass[membershipType] ??
                membershipBadgeClass.free
              }`}
            >
              {membershipLabels[membershipType] ?? membershipType}
            </Badge>
            {user.membership_expires_at && membershipType !== "free" && (
              <span className="text-xs text-muted-foreground">
                หมดอายุ{" "}
                {new Date(user.membership_expires_at).toLocaleDateString(
                  "th-TH",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </span>
            )}
          </div>
        </div>

        {membershipType === "free" && (
          <Link href="/pricing">
            <Button
              size="sm"
              className="bg-brand hover:bg-brand-light text-white gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              อัปเกรดแพ็กเกจ
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-8">
        {/* Quick Actions — always shown */}
        <QuickActions />

        {/* Stats & progress — only when data exists */}
        {hasData ? (
          <>
            <StatsOverview overall={stats.overall} />

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
