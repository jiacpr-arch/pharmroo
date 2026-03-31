"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  BookOpen,
  BarChart3,
  Star,
  Zap,
  CheckSquare,
  Plus,
  Trash2,
  Download,
  Share2,
  Trophy,
  ChevronRight,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

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

interface StudyTask {
  id: string;
  text: string;
  done: boolean;
}

// ─── Rank System ─────────────────────────────────────────────────────────────

const RANKS = [
  { label: "Student นศภ.", icon: "📖", color: "text-gray-600", bg: "bg-gray-100", min: 0, max: 99 },
  { label: "Trainee ฝึกงาน", icon: "📋", color: "text-blue-700", bg: "bg-blue-100", min: 100, max: 499 },
  { label: "Pharmacist ภ.บ.", icon: "💊", color: "text-green-700", bg: "bg-green-100", min: 500, max: 999 },
  { label: "Specialist ภ.ม.", icon: "🧪", color: "text-purple-700", bg: "bg-purple-100", min: 1000, max: Infinity },
] as const;

function getRank(totalAttempts: number) {
  return RANKS.find((r) => totalAttempts >= r.min && totalAttempts <= r.max) ?? RANKS[0];
}

function getRankProgress(totalAttempts: number) {
  const rank = getRank(totalAttempts);
  if (rank.max === Infinity) return 100;
  const span = rank.max - rank.min + 1;
  const done = totalAttempts - rank.min;
  return Math.min(100, Math.round((done / span) * 100));
}

function getNextRankLabel(totalAttempts: number) {
  const idx = RANKS.findIndex((r) => totalAttempts >= r.min && totalAttempts <= r.max);
  if (idx < 0 || idx >= RANKS.length - 1) return null;
  return `${RANKS[idx + 1].label} (${RANKS[idx + 1].min} ข้อ)`;
}

// ─── Subject Icon Map (fallback) ─────────────────────────────────────────────

const SUBJECT_ICON_MAP: Record<string, string> = {
  pharma_chem: "⚗️",
  pharmacology: "💊",
  pharma_care: "🏥",
  clinical_pharm: "🩺",
  pharm_tech: "🏭",
  biopharm: "🧬",
  pharm_admin: "📋",
  toxicology: "☠️",
  cosmetic: "✨",
  herbal_med: "🌿",
  pharm_law: "⚖️",
  biochem: "🔬",
  public_health_pharm: "📊",
  drug_info: "📖",
  compounding: "🧪",
  nutrition: "🥗",
  pharma_marketing: "📈",
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "overview" | "badge" | "plan";

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [data, setData] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const badgeRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Fetch stats
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/mcq/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [status]);

  // Load study plan from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pharmru-plan-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist study plan
  useEffect(() => {
    try {
      localStorage.setItem("pharmru-plan-tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  const user = session!.user as {
    name?: string;
    email?: string;
    membership_type?: string;
  };

  const displayName = user.name || "นักศึกษาเภสัชศาสตร์";
  const overall = data?.overall;
  const totalAttempts = overall?.total_attempts ?? 0;
  const rank = getRank(totalAttempts);
  const rankProgress = getRankProgress(totalAttempts);
  const nextRank = getNextRankLabel(totalAttempts);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} วิ`;
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m} นาที`;
    return `${Math.floor(m / 60)} ชม. ${m % 60} นาที`;
  };

  // Study plan helpers
  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: Date.now().toString(), text, done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>💊</span> ฟาร์มรู้ PharmRu — Student Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">ยินดีต้อนรับ, {displayName}</p>
        </div>

        {/* Rank badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${rank.bg}`}>
          <span className="text-2xl">{rank.icon}</span>
          <div>
            <p className={`font-bold text-sm ${rank.color}`}>{rank.label}</p>
            <p className="text-xs text-muted-foreground">{totalAttempts} ข้อ</p>
          </div>
        </div>
      </div>

      {/* ── XP Progress Bar ─────────────────────────────────────────────── */}
      {rank.max !== Infinity && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{rank.label}</span>
            {nextRank && <span>ถัดไป: {nextRank}</span>}
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-brand transition-all"
              style={{ width: `${rankProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {rankProgress}% ไปสู่ rank ถัดไป
          </p>
        </div>
      )}

      {/* ── Quick Stats ─────────────────────────────────────────────────── */}
      {!statsLoading && overall && (
        <div className="grid grid-cols-3 gap-3 mb-6">
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
              <p className={`text-2xl font-bold ${overall.accuracy_pct >= 60 ? "text-green-600" : "text-red-500"}`}>
                {overall.accuracy_pct}%
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
      )}

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Link href="/ple/practice">
          <Card className="hover:border-brand/40 hover:shadow-sm transition-all cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col gap-2">
              <Zap className="h-5 w-5 text-brand" />
              <p className="font-semibold text-sm">Quick Quiz</p>
              <p className="text-xs text-muted-foreground">5 ข้อ MCQ สุ่มจากข้อสอบสภาเภสัชฯ</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ple/mock">
          <Card className="hover:border-brand/40 hover:shadow-sm transition-all cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <p className="font-semibold text-sm">Mock Exam</p>
              <p className="text-xs text-muted-foreground">Mock Exam: สภาเภสัชฯ เต็มชุด</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/challenges">
          <Card className="hover:border-brand/40 hover:shadow-sm transition-all cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <p className="font-semibold text-sm">Challenges</p>
              <p className="text-xs text-muted-foreground">ทำโจทย์พิเศษรับ XP เพิ่ม</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b mb-6">
        {([
          { key: "overview", label: "ภาพรวม", icon: BarChart3 },
          { key: "badge", label: "Badge", icon: Star },
          { key: "plan", label: "Study Plan", icon: CheckSquare },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ───────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {statsLoading ? (
            <p className="text-center text-muted-foreground py-8">กำลังโหลดสถิติ...</p>
          ) : !data || data.overall.total_attempts === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1">ยังไม่มีข้อมูล</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  เริ่มทำข้อสอบ PLE เพื่อดูสถิติของคุณ
                </p>
                <Link href="/ple/practice">
                  <Button className="bg-brand hover:bg-brand-light text-white">
                    เริ่มทำข้อสอบ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Weak Areas */}
              {data.weakAreas.length > 0 && (
                <Card className="border-amber-300 bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-bold text-amber-800">สาขาที่ควรเน้น</h3>
                        <p className="text-xs text-amber-700/70 mt-0.5">AI Buddy แนะนำให้ฝึกเพิ่ม</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {data.weakAreas.map((s) => (
                        <div key={s.subject_id} className="flex items-center justify-between gap-2">
                          <span className="text-sm">
                            {s.icon || SUBJECT_ICON_MAP[s.subject_id] || "📝"} {s.name_th}
                            <span className="text-red-600 ml-2 font-medium">{s.accuracy_pct}%</span>
                          </span>
                          <Link href={`/ple/practice?subject=${s.subject_id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs shrink-0">
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
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-brand" /> คะแนนแยกตามสาขา
                  </h3>
                  <div className="space-y-3">
                    {data.subjects.map((s) => (
                      <div key={s.subject_id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {s.icon || SUBJECT_ICON_MAP[s.subject_id] || "📝"} {s.name_th}
                          </span>
                          <span className="font-medium shrink-0">
                            {s.correct}/{s.total}
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ml-1.5 ${
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

              {/* Time stat */}
              {data.overall.total_time_seconds > 0 && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-brand shrink-0" />
                    <div>
                      <p className="font-semibold">เวลาที่ใช้ทั้งหมด</p>
                      <p className="text-2xl font-bold">{formatTime(data.overall.total_time_seconds)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Sessions */}
              {data.recentSessions.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-3">ประวัติการสอบล่าสุด</h3>
                    <div className="space-y-2">
                      {data.recentSessions.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] shrink-0 ${
                                s.mode === "mock"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {s.mode === "mock" ? "สอบจำลอง" : "ฝึกทำ"}
                            </Badge>
                            <span className="text-muted-foreground truncate">
                              {s.subject_icon} {s.subject_name_th ?? "ทุกสาขา"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
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
                    <Link href="/ple">
                      <Button variant="ghost" size="sm" className="w-full mt-2 text-brand">
                        ดูทั้งหมด <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Tab: Badge ──────────────────────────────────────────────────── */}
      {activeTab === "badge" && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            ฟาร์มรู้ Badge Card — แสดงผลการเรียนของคุณ
          </p>

          {/* Badge Card */}
          <div ref={badgeRef} className="max-w-sm mx-auto">
            <div className="rounded-2xl border-2 border-brand/30 bg-gradient-to-br from-brand-dark via-brand-dark to-brand p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{rank.icon}</span>
                <div>
                  <p className="font-bold text-lg leading-tight">ฟาร์มรู้ Badge Card</p>
                  <p className="text-white/70 text-sm">PharmRu Student Dashboard</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-xl font-bold">{displayName}</p>
                <p className={`text-sm mt-0.5 font-medium`}>{rank.icon} {rank.label}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xl font-bold">{totalAttempts}</p>
                  <p className="text-white/70 text-xs">ข้อที่ทำ</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xl font-bold">{overall?.accuracy_pct ?? 0}%</p>
                  <p className="text-white/70 text-xs">ถูกต้อง</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xl font-bold">{overall?.total_sessions ?? 0}</p>
                  <p className="text-white/70 text-xs">ครั้งที่สอบ</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>XP Progress</span>
                  <span>{rankProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-white transition-all"
                    style={{ width: `${rankProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 text-center text-white/50 text-xs">
                pharmru.com • ฟาร์มรู้ PharmRu
              </div>
            </div>
          </div>

          {/* Share button */}
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "ฟาร์มรู้ Badge Card",
                    text: `${displayName} — ${rank.label} | ${totalAttempts} ข้อ ${overall?.accuracy_pct ?? 0}% ถูกต้อง`,
                    url: window.location.origin,
                  }).catch(() => {});
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              แชร์
            </Button>
          </div>

          {/* All ranks */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" /> Rank ทั้งหมด
              </h3>
              <div className="space-y-2">
                {RANKS.map((r) => {
                  const isActive = rank.label === r.label;
                  return (
                    <div
                      key={r.label}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isActive ? `${r.bg} border border-current/20` : "bg-muted/30"
                      }`}
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${isActive ? r.color : "text-muted-foreground"}`}>
                          {r.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.max === Infinity ? `${r.min}+ ข้อ` : `${r.min}–${r.max} ข้อ`}
                        </p>
                      </div>
                      {isActive && (
                        <Badge className={`${r.bg} ${r.color} border-0 text-xs`}>ตำแหน่งปัจจุบัน</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Study Plan ─────────────────────────────────────────────── */}
      {activeTab === "plan" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
              <CheckSquare className="h-5 w-5 text-brand" /> แผนการติวของฉัน
            </h2>
            <p className="text-sm text-muted-foreground">
              บันทึกไว้ในเบราว์เซอร์ของคุณ (localStorage)
            </p>
          </div>

          {/* Suggested tasks */}
          <Card className="border-brand/20 bg-brand/5">
            <CardContent className="p-4">
              <p className="font-semibold text-sm text-brand mb-2">💡 AI Buddy แนะนำสัปดาห์นี้</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {data?.weakAreas.slice(0, 3).map((s) => (
                  <li key={s.subject_id} className="flex items-center gap-2">
                    <span>•</span>
                    <span>
                      ทบทวน {s.icon} {s.name_th} (ปัจจุบัน {s.accuracy_pct}%)
                    </span>
                    <button
                      onClick={() => {
                        const text = `ทบทวน ${s.icon} ${s.name_th}`;
                        setTasks((prev) => [
                          ...prev,
                          { id: Date.now().toString(), text, done: false },
                        ]);
                      }}
                      className="ml-auto text-brand hover:underline text-xs shrink-0"
                    >
                      + เพิ่ม
                    </button>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>Long Case / OSPE อย่างน้อย 2 เคส</span>
                  <button
                    onClick={() => {
                      setTasks((prev) => [
                        ...prev,
                        { id: Date.now().toString(), text: "Long Case / OSPE อย่างน้อย 2 เคส", done: false },
                      ]);
                    }}
                    className="ml-auto text-brand hover:underline text-xs shrink-0"
                  >
                    + เพิ่ม
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>Mock Exam สภาเภสัชฯ 1 ชุด</span>
                  <button
                    onClick={() => {
                      setTasks((prev) => [
                        ...prev,
                        { id: Date.now().toString(), text: "Mock Exam สภาเภสัชฯ 1 ชุด", done: false },
                      ]);
                    }}
                    className="ml-auto text-brand hover:underline text-xs shrink-0"
                  >
                    + เพิ่ม
                  </button>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Task list */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold mb-3">รายการของฉัน</h3>

              {/* Add task input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleAddKeyDown}
                  placeholder="เพิ่มรายการใหม่..."
                  className="flex-1 text-sm border rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-brand"
                />
                <Button size="sm" onClick={addTask} className="bg-brand hover:bg-brand-light text-white shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">
                  ยังไม่มีรายการ เพิ่มจาก AI Buddy หรือพิมพ์เอง
                </p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        task.done ? "bg-muted/40 border-muted" : "bg-white border-border"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="h-4 w-4 accent-brand shrink-0 cursor-pointer"
                      />
                      <span
                        className={`flex-1 text-sm ${task.done ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.text}
                      </span>
                      <button
                        onClick={() => removeTask(task.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {tasks.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-right">
                  {tasks.filter((t) => t.done).length}/{tasks.length} เสร็จแล้ว
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/ple/practice">
              <Card className="hover:border-brand/40 hover:shadow-sm transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-brand" />
                  <span className="text-sm font-medium">ฝึก MCQ</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/ple/mock">
              <Card className="hover:border-brand/40 hover:shadow-sm transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-medium">Mock Exam</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
