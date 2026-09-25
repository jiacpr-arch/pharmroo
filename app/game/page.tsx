import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, Play, ShieldCheck, Stethoscope, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getGameBests, getGameTotals, type GameBest } from "@/lib/db/queries-game";
import { GAME_SCENARIOS } from "@/lib/game/scenarios";
import { xpToRank } from "@/lib/game/rank";
import ClaimLocalRuns from "@/components/game/ClaimLocalRuns";
import LocalProgressCard from "@/components/game/LocalProgressCard";

export const metadata: Metadata = {
  title: "เกมร้านยา — ซักประวัติและจ่ายยาในร้านยา",
  description:
    "คุณคือเภสัชกรประจำร้าน — ซักประวัติ คัดกรอง red flag เลือกยาให้ถูกคน ภายใต้เวลากดดัน ตัดสินใจผิด ผู้ป่วยแย่ลงจริง เก็บ XP และ badge",
};

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, { label: string; className: string }> = {
  otc: { label: "จ่ายยา OTC", className: "bg-teal-100 text-teal-700" },
  interaction: { label: "Drug Interaction", className: "bg-rose-100 text-rose-700" },
  referral: { label: "ส่งต่อแพทย์", className: "bg-amber-100 text-amber-700" },
  chronic: { label: "โรคเรื้อรัง · จ่ายยาหลายตัว", className: "bg-indigo-100 text-indigo-700" },
  allergy: { label: "แพ้/ภูมิแพ้", className: "bg-sky-100 text-sky-700" },
};

const GRADE_STYLE: Record<string, string> = {
  S: "bg-amber-100 text-amber-700",
  A: "bg-teal-100 text-teal-700",
  B: "bg-emerald-100 text-emerald-700",
  C: "bg-rose-100 text-rose-700",
};

export default async function GameHubPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const [bests, totals] = userId
    ? await Promise.all([
        getGameBests(userId).catch(() => ({} as Record<string, GameBest>)),
        getGameTotals(userId).catch(() => ({ played: 0, wins: 0, xp: 0 })),
      ])
    : [{} as Record<string, GameBest>, null];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Hero โทนเกม (ธีมร้านยาช่วงเย็น) */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0d1a24] px-6 py-10 text-center text-white sm:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 130% 60% at 50% -10%, rgba(242,193,78,.28), transparent 60%), radial-gradient(ellipse 120% 60% at 50% 115%, rgba(13,148,136,.35), transparent 55%)",
          }}
        />
        <div className="relative space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[.4em] text-teal-300">
            Drugstore · Counter Shift
          </p>
          <h1 className="text-3xl font-black sm:text-4xl">
            เกม<span className="text-amber-400">ร้านยา</span>
          </h1>
          <p className="mx-auto max-w-md text-sm leading-7 text-slate-300">
            คุณคือ <b className="text-white">เภสัชกรประจำร้าน</b> — ซักประวัติ คัดกรอง red flag
            เลือกยาให้ถูกคน ภายใต้เวลากดดัน ตัดสินใจผิด ผู้ป่วยแย่ลงจริง
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1">
              <ClipboardList className="h-3.5 w-3.5 text-teal-300" /> ซักประวัติแบบ WWHAM
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> เก็บ XP + Badge
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> เล่นฟรี ไม่ต้องล็อกอิน
            </span>
          </div>
        </div>
      </section>

      <div className="mt-6">
        {userId && totals ? (
          <>
            {/* เพิ่งล็อกอินแล้วมีของค้างในเครื่อง — ยกเข้าบัญชีเงียบๆ */}
            <ClaimLocalRuns />
            <PharmacistCard xp={totals.xp} played={totals.played} wins={totals.wins} />
          </>
        ) : (
          /* ยังไม่ล็อกอิน — โชว์ความคืบหน้าที่เก็บไว้ในเครื่อง (ถ้ามี) */
          <LocalProgressCard />
        )}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        เลือกเคส
      </h2>
      <div className="space-y-4">
        {GAME_SCENARIOS.map((s) => {
          const best = bests[s.slug];
          const cat = CATEGORY_LABEL[s.category ?? ""] ?? { label: "เคสร้านยา", className: "bg-muted" };
          return (
            <Card key={s.slug} className="transition-shadow hover:shadow-md hover:ring-brand/30">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={cat.className}>{cat.label}</Badge>
                    {best && (
                      <Badge className={GRADE_STYLE[best.grade] ?? "bg-muted"}>
                        <Trophy className="mr-1 h-3 w-3" />
                        เกรดดีสุด {best.grade} · เล่นแล้ว {best.runs} รอบ
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.subtitle}</p>
                </div>
                <Link href={`/game/${s.slug}`} className="shrink-0">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    <Play className="h-4 w-4" /> รับลูกค้า
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        เล่นฟรีทุกเคส · ล็อกอินเพื่อเก็บ XP และ badge บน{" "}
        <Link href="/dashboard" className="font-semibold text-brand underline">
          Dashboard
        </Link>{" "}
        · ฝึกข้อสอบต่อได้ที่{" "}
        <Link href="/ple/practice" className="font-semibold text-brand underline">
          PLE Practice
        </Link>
      </p>
    </div>
  );
}

function PharmacistCard({ xp, played, wins }: { xp: number; played: number; wins: number }) {
  const { rank, next, xpForNext, xpIntoRank, progress } = xpToRank(xp);
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden>{rank.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-bold text-brand-dark">
            <Stethoscope className="h-4 w-4 text-brand" /> {rank.title}
          </p>
          <p className="text-sm text-muted-foreground">{rank.trait}</p>
          <p className="mt-1 text-sm">
            เล่นแล้ว {played} เคส · ชนะ {wins} · {xp.toLocaleString("th-TH")} XP
          </p>
          {next ? (
            <div className="mt-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                อีก {(xpForNext - xpIntoRank).toLocaleString("th-TH")} XP ถึง <b>{next.title}</b>
              </p>
            </div>
          ) : (
            <p className="mt-1 text-xs text-amber-700">ขั้นสูงสุดของสายร้านยาแล้ว</p>
          )}
        </div>
      </div>
    </div>
  );
}
