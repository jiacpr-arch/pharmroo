"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Zap, AlertTriangle, Trophy, Star,
  CheckSquare, Plus, Trash2, ChevronRight, Flame,
  ArrowRight, Lock, CheckCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  total_questions: number;
  correct_count: number;
  pct: number;
  created_at: string;
  subject_name_th: string | null;
  subject_icon: string | null;
}

interface AccuracyTrend {
  week_start: string;
  total_attempts: number;
  correct_count: number;
  accuracy: number;
}

interface SubjectComparison {
  subject_id: string;
  subject_name_th: string;
  subject_icon: string;
  user_accuracy: number;
  global_accuracy: number;
  diff: number;
}

interface StatsData {
  overall: {
    total_attempts: number;
    correct_count: number;
    accuracy_pct: number;
    total_time_seconds: number;
    total_sessions: number;
  };
  subjects: SubjectBreakdown[];
  weakAreas: SubjectBreakdown[];
  recentSessions: RecentSession[];
  streak: number;
  trend: AccuracyTrend[];
  comparison: SubjectComparison[];
}

interface StudyTask { id: string; text: string; done: boolean; }

// ─── Rank system ─────────────────────────────────────────────────────────────

const PHARMACY_RANKS = [
  { min: 0,    max: 99,       label: "Student นศภ.",     short: "Student",    icon: "📖", bg: "bg-emerald-600" },
  { min: 100,  max: 499,      label: "Trainee ฝึกงาน",   short: "Trainee",    icon: "📋", bg: "bg-blue-600" },
  { min: 500,  max: 999,      label: "Pharmacist ภ.บ.",  short: "Pharmacist", icon: "💊", bg: "bg-purple-600" },
  { min: 1000, max: Infinity, label: "Specialist ภ.ม.",  short: "Specialist", icon: "🧪", bg: "bg-amber-500" },
] as const;

const NURSING_RANKS = [
  { min: 0,    max: 99,       label: "Student นศพ.",       short: "Student",    icon: "📖", bg: "bg-emerald-600" },
  { min: 100,  max: 499,      label: "Trainee ฝึกงาน",     short: "Trainee",    icon: "📋", bg: "bg-blue-600" },
  { min: 500,  max: 999,      label: "Nurse พ.บ.",         short: "Nurse",      icon: "💉", bg: "bg-rose-600" },
  { min: 1000, max: Infinity, label: "Specialist พยาบาล",  short: "Specialist", icon: "🩺", bg: "bg-amber-500" },
] as const;

function getRanks(category: string | null | undefined) {
  return category === "nursing" ? NURSING_RANKS : PHARMACY_RANKS;
}

function getRank(xp: number, category: string | null | undefined) {
  const ranks = getRanks(category);
  return ranks.find((r) => xp >= r.min && xp <= r.max) ?? ranks[0];
}

function xpToNextRank(xp: number, category: string | null | undefined) {
  const rank = getRank(xp, category);
  if (rank.max === Infinity) return null;
  return { current: xp - rank.min, total: rank.max - rank.min + 1, next: rank.max + 1 };
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────

function RadarChart({ subjects }: { subjects: SubjectBreakdown[] }) {
  const items = subjects.slice(0, 10);
  const N = items.length;
  if (N < 3) return (
    <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
      ทำข้อสอบอย่างน้อย 3 สาขาเพื่อดู Radar Chart
    </div>
  );

  const CX = 160, CY = 155, R = 100, LABEL_R = R + 28;
  const angle = (i: number) => (2 * Math.PI * i / N) - Math.PI / 2;
  const pt = (i: number, val: number) => ({
    x: CX + (val / 100) * R * Math.cos(angle(i)),
    y: CY + (val / 100) * R * Math.sin(angle(i)),
  });
  const outer = (i: number) => ({
    x: CX + R * Math.cos(angle(i)),
    y: CY + R * Math.sin(angle(i)),
  });
  const label = (i: number) => ({
    x: CX + LABEL_R * Math.cos(angle(i)),
    y: CY + LABEL_R * Math.sin(angle(i)),
  });

  const gridPoly = (level: number) =>
    items.map((_, i) => { const p = pt(i, level); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ");

  const valuePoly = items
    .map((d, i) => { const p = pt(i, d.accuracy_pct); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; })
    .join(" ");

  return (
    <svg viewBox="0 0 320 310" className="w-full max-h-72">
      {[25, 50, 75, 100].map((lv) => (
        <polygon key={lv} points={gridPoly(lv)} fill="none" stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {items.map((_, i) => {
        const o = outer(i);
        return <line key={i} x1={CX} y1={CY} x2={o.x.toFixed(1)} y2={o.y.toFixed(1)} stroke="#e5e7eb" strokeWidth="1" />;
      })}
      <polygon points={valuePoly} fill="rgba(16,185,129,0.18)" stroke="#10b981" strokeWidth="2" />
      {items.map((d, i) => {
        const p = pt(i, d.accuracy_pct);
        return <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill="#10b981" />;
      })}
      {items.map((d, i) => {
        const lp = label(i);
        const name = d.name_th.length > 8 ? d.name_th.slice(0, 7) + "…" : d.name_th;
        return (
          <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)} textAnchor="middle"
            dominantBaseline="middle" fontSize="10" fill="#6b7280">
            {d.icon} {name}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Challenges data (same as /challenges page) ───────────────────────────────

type Challenge = { id: string; title: string; icon: string; xp: number; href: string };

function getChallenges(category: string | null | undefined): Challenge[] {
  const isNursing = category === "nursing";
  const practice = isNursing ? "/nursing/practice" : "/ple/practice";
  const mock = isNursing ? "/nursing/mock" : "/ple/mock";

  const generic: Challenge[] = [
    { id: "daily_10",          title: "ทำ 10 ข้อวันนี้",       icon: "📝", xp: 50,   href: practice },
    { id: "daily_accuracy",    title: "แม่นยำ 80%+",            icon: "🎯", xp: 100,  href: practice },
    { id: "daily_mock",        title: "สอบ Mock วันนี้",        icon: "📋", xp: 150,  href: mock },
    { id: "week_streak_5",     title: "5 วันติดต่อกัน",          icon: "🔥", xp: 300,  href: practice },
    { id: "week_all_subjects", title: "ครบทุกสาขา",             icon: "🌐", xp: 500,  href: practice },
    { id: "week_100",          title: "100 ข้อในสัปดาห์",       icon: "💯", xp: 400,  href: practice },
    { id: "special_mock_pass", title: "ผ่าน Mock ครั้งแรก",     icon: "🏅", xp: 800,  href: mock },
  ];

  const trackSpecific: Challenge[] = isNursing
    ? [
        { id: "nle_adult_master",   title: "การพยาบาลผู้ใหญ่มาสเตอร์", icon: "🩺", xp: 600, href: `${practice}` },
        { id: "nle_obstetric",      title: "สูติฯ ไม่ง้อจด",            icon: "👶", xp: 400, href: `${practice}` },
        { id: "special_500_nle",    title: "นักศึกษาพยาบาลจริงจัง",     icon: "💉", xp: 1000, href: practice },
      ]
    : [
        { id: "special_pharma_chem", title: "เภสัชเคมีมาสเตอร์",   icon: "⚗️", xp: 600, href: `${practice}?subject=pharma_chem` },
        { id: "special_pharm_law",   title: "กฎหมายไม่ง้อจด",     icon: "⚖️", xp: 400, href: `${practice}?subject=pharm_law` },
        { id: "special_500",         title: "นักศึกษาจริงจัง",     icon: "💊", xp: 1000, href: practice },
      ];

  return [...generic, ...trackSpecific];
}

// ─── Tab type ────────────────────────────────────────────────────────────────

type Tab = "overview" | "weak" | "challenge" | "badge";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StatsData | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimMsg, setClaimMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/mcq/stats").then((r) => r.json()),
      fetch("/api/challenges").then((r) => r.json()),
    ]).then(([stats, ch]) => {
      setData(stats);
      setCompletedChallenges(new Set(ch.completed ?? []));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [status, router]);

  useEffect(() => {
    try { const s = localStorage.getItem("pharmru-plan-tasks"); if (s) setTasks(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("pharmru-plan-tasks", JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  const user = session?.user as { name?: string; exam_category?: string | null } | undefined;
  const examCategory = user?.exam_category ?? null;
  const isNursing = examCategory === "nursing";
  const practiceUrl = isNursing ? "/nursing/practice" : "/ple/practice";
  const subjectUrlBase = isNursing ? "/nursing/practice" : "/ple/practice";
  const defaultName = isNursing ? "นักศึกษาพยาบาล" : "นักศึกษาเภสัชศาสตร์";
  const displayName = user?.name || defaultName;
  const xp = data?.overall.total_attempts ?? 0;
  const rank = getRank(xp, examCategory);
  const xpInfo = xpToNextRank(xp, examCategory);
  const ranksForUser = getRanks(examCategory);
  const quizSourceLabel = isNursing
    ? "5 ข้อ MCQ สุ่มจากข้อสอบสภาการพยาบาล · บันทึกผลอัตโนมัติ"
    : "5 ข้อ MCQ สุ่มจากข้อสอบสภาเภสัชฯ · บันทึกผลอัตโนมัติ";
  const challenges = getChallenges(examCategory);
  const streak = data?.streak ?? 0;
  const accuracy = data?.overall.accuracy_pct ?? 0;
  const subjects = data?.subjects ?? [];
  const weakAreas = data?.weakAreas ?? [];

  // Study plan helpers
  const addTask = () => {
    const t = newTask.trim(); if (!t) return;
    setTasks((p) => [...p, { id: Date.now().toString(), text: t, done: false }]);
    setNewTask("");
  };

  const handleClaim = async (id: string) => {
    setClaiming(id); setClaimMsg(null);
    try {
      const res = await fetch("/api/challenges", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challenge_id: id }),
      });
      if (res.ok) {
        setCompletedChallenges((p) => new Set([...p, id]));
        const def = challenges.find((c) => c.id === id);
        setClaimMsg({ ok: true, text: `🎉 สำเร็จ! +${def?.xp ?? 0} XP` });
      } else {
        setClaimMsg({ ok: false, text: "ยังไม่ครบเงื่อนไข ลองทำเพิ่มก่อนนะ" });
      }
    } catch { setClaimMsg({ ok: false, text: "เกิดข้อผิดพลาด" }); }
    finally {
      setClaiming(null);
      setTimeout(() => setClaimMsg(null), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-dark to-brand p-5 text-white mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${rank.bg} flex items-center justify-center text-3xl shrink-0`}>
              {rank.icon}
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">{displayName}</p>
              <p className="text-white/70 text-sm">{rank.short} · {xp} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold flex items-center gap-1">
                <Flame className={`h-5 w-5 ${streak >= 3 ? "text-orange-300" : "text-white/40"}`} />
                {streak}
              </p>
              <p className="text-white/60 text-xs">Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{xp}</p>
              <p className="text-white/60 text-xs">ข้อ</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-white/60 text-xs">เฉลี่ย</p>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        {xpInfo && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>{rank.short}</span>
              <span>{xpInfo.current}/{xpInfo.total} XP → {ranksForUser[ranksForUser.findIndex(r => r.min === rank.min) + 1]?.short}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5">
              <div className="h-2.5 rounded-full bg-white transition-all"
                style={{ width: `${Math.min(100, Math.round(xpInfo.current / xpInfo.total * 100))}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Quick Quiz Banner ───────────────────────────────────────── */}
      <div className="rounded-xl border border-brand/20 bg-brand/5 px-5 py-4 flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-brand shrink-0" />
          <div>
            <p className="font-bold text-sm">Quick Quiz 5 นาที</p>
            <p className="text-xs text-muted-foreground">{quizSourceLabel}</p>
          </div>
        </div>
        <Link href={practiceUrl}>
          <Button size="sm" className="bg-brand hover:bg-brand-light text-white gap-1 shrink-0">
            เริ่มเลย <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b mb-6 overflow-x-auto">
        {([
          { key: "overview",   label: "ภาพรวม" },
          { key: "weak",       label: "จุดอ่อน & แผนติว" },
          { key: "challenge",  label: "Challenge" },
          { key: "badge",      label: "Badge & Rank" },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === key ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: ภาพรวม ─────────────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="space-y-6">
          {subjects.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-bold mb-2">ยังไม่มีข้อมูล</p>
              <p className="text-sm mb-4">เริ่มทำข้อสอบเพื่อดูสถิติของคุณ</p>
              <Link href={practiceUrl}><Button className="bg-brand hover:bg-brand-light text-white">เริ่มทำข้อสอบ</Button></Link>
            </div>
          ) : (
            <>
              {/* Radar chart */}
              <div>
                <h2 className="font-bold mb-3">คะแนนเฉลี่ยแยกสาขา</h2>
                <RadarChart subjects={[...subjects].sort((a,b) => b.total - a.total)} />
              </div>

              {/* Subject cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...subjects].sort((a, b) => b.accuracy_pct - a.accuracy_pct).map((s) => {
                  const weak = s.accuracy_pct < 60;
                  const color = s.accuracy_pct >= 80 ? "text-green-600" : s.accuracy_pct >= 60 ? "text-yellow-600" : "text-red-600";
                  const bar = s.accuracy_pct >= 80 ? "bg-green-500" : s.accuracy_pct >= 60 ? "bg-yellow-400" : "bg-red-500";
                  return (
                    <Link key={s.subject_id} href={`${subjectUrlBase}?subject=${s.subject_id}`}>
                      <div className="relative rounded-xl border bg-white p-4 hover:shadow-sm hover:border-brand/30 transition-all cursor-pointer">
                        {weak && (
                          <span className="absolute top-2 right-2 text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                            ต้องเพิ่ม
                          </span>
                        )}
                        <p className="text-sm text-muted-foreground mb-1">{s.icon} {s.name_th}</p>
                        <p className={`text-3xl font-bold ${color}`}>{s.accuracy_pct}<span className="text-lg">%</span></p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 my-2">
                          <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${s.accuracy_pct}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">ทำแล้ว {s.total} ข้อ</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Tab: จุดอ่อน & แผนติว ───────────────────────────────────── */}
      {tab === "weak" && (
        <div className="space-y-6">
          {/* Weak areas */}
          {weakAreas.length > 0 && (
            <div>
              <h2 className="font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" /> สาขาที่ต้องทบทวน (ถูกต้อง &lt; 60%)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weakAreas.map((s) => (
                  <div key={s.subject_id} className="flex items-center justify-between rounded-xl border bg-red-50 border-red-100 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{s.name_th}</p>
                        <p className="text-red-600 text-xs font-bold">{s.accuracy_pct}% · ผิด {s.total - s.correct} ข้อ</p>
                      </div>
                    </div>
                    <Link href={`${subjectUrlBase}?subject=${s.subject_id}`}>
                      <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-600 hover:bg-red-100">
                        ฝึกเพิ่ม <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study plan */}
          <div>
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-brand" /> แผนติวของฉัน
            </h2>

            {/* AI suggestions */}
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 mb-4">
              <p className="text-sm font-semibold text-brand mb-2">💡 AI แนะนำ</p>
              <div className="space-y-1.5">
                {weakAreas.slice(0, 3).map((s) => (
                  <div key={s.subject_id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ทบทวน {s.icon} {s.name_th}</span>
                    <button onClick={() => setTasks((p) => [...p, { id: Date.now().toString(), text: `ทบทวน ${s.icon} ${s.name_th}`, done: false }])}
                      className="text-xs text-brand hover:underline shrink-0 ml-2">+ เพิ่ม</button>
                  </div>
                ))}
                {[
                  "Long Case / OSPE อย่างน้อย 2 เคส",
                  "Mock Exam สภาเภสัชฯ 1 ชุด",
                ].map((t) => (
                  <div key={t} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t}</span>
                    <button onClick={() => setTasks((p) => [...p, { id: Date.now().toString(), text: t, done: false }])}
                      className="text-xs text-brand hover:underline shrink-0 ml-2">+ เพิ่ม</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Task list */}
            <div className="flex gap-2 mb-3">
              <input value={newTask} onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="เพิ่มรายการใหม่..."
                className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-brand" />
              <Button size="sm" onClick={addTask} className="bg-brand hover:bg-brand-light text-white shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">ยังไม่มีรายการ</p>
              )}
              {tasks.map((t) => (
                <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border ${t.done ? "bg-muted/40" : "bg-white"}`}>
                  <input type="checkbox" checked={t.done} onChange={() => setTasks((p) => p.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}
                    className="h-4 w-4 accent-brand shrink-0 cursor-pointer" />
                  <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.text}</span>
                  <button onClick={() => setTasks((p) => p.filter((x) => x.id !== t.id))}
                    className="text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {tasks.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {tasks.filter((t) => t.done).length}/{tasks.length} เสร็จแล้ว
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Challenge ───────────────────────────────────────────── */}
      {tab === "challenge" && (
        <div className="space-y-3">
          {claimMsg && (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium ${claimMsg.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {claimMsg.text}
            </div>
          )}
          {challenges.map((c) => {
            const done = completedChallenges.has(c.id);
            return (
              <div key={c.id} className={`flex items-center justify-between rounded-xl border p-4 gap-3 ${done ? "bg-green-50 border-green-200" : "bg-white"}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{c.icon}</span>
                  <p className="font-medium text-sm truncate">{c.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-amber-600">+{c.xp} XP</span>
                  {done ? (
                    <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="h-3.5 w-3.5" /> สำเร็จ</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Link href={c.href}>
                        <Button size="sm" className="bg-brand hover:bg-brand-light text-white h-7 text-xs">ลุย</Button>
                      </Link>
                      <Button size="sm" variant="outline" className="h-7 text-xs" disabled={claiming === c.id} onClick={() => handleClaim(c.id)}>
                        {claiming === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "รับ"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div className="pt-2 text-center">
            <Link href="/challenges">
              <Button variant="outline" size="sm" className="gap-1">
                ดู Challenges ทั้งหมด <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Tab: Badge & Rank ────────────────────────────────────────── */}
      {tab === "badge" && (
        <div className="space-y-6">
          {/* Badge card */}
          <div className="max-w-sm mx-auto rounded-2xl bg-gradient-to-br from-brand-dark to-brand p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{rank.icon}</span>
              <div>
                <p className="font-bold text-lg">ฟาร์มรู้ Badge Card</p>
                <p className="text-white/60 text-sm">pharmru.com</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-xl font-bold">{displayName}</p>
              <p className="text-white/70 text-sm">{rank.label}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { val: xp, label: "ข้อที่ทำ" },
                { val: `${accuracy}%`, label: "ถูกต้อง" },
                { val: streak, label: "Streak" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white/10 rounded-lg p-3">
                  <p className="text-xl font-bold">{val}</p>
                  <p className="text-white/60 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rank table */}
          <div className="space-y-2">
            {RANKS.map((r) => {
              const active = rank.label === r.label;
              return (
                <div key={r.label} className={`flex items-center gap-3 p-4 rounded-xl border ${active ? "border-brand/30 bg-brand/5" : "bg-white"}`}>
                  <span className={`w-10 h-10 rounded-lg ${r.bg} flex items-center justify-center text-xl`}>{r.icon}</span>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${active ? "text-brand" : ""}`}>{r.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.max === Infinity ? `${r.min}+ ข้อ` : `${r.min}–${r.max} ข้อ`}
                    </p>
                  </div>
                  {active && <Badge className="bg-brand/10 text-brand border-0 text-xs">ตำแหน่งปัจจุบัน</Badge>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
