"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Trophy, Flame, Star, Lock, CheckCircle } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "daily" | "weekly" | "special";
  xp: number;
  href: string;
  condition: string;
  completed?: boolean;
  locked?: boolean;
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "daily_10",
    title: "ทำ 10 ข้อวันนี้",
    description: "ทำ MCQ ให้ครบ 10 ข้อในวันนี้",
    icon: "📝",
    type: "daily",
    xp: 50,
    href: "/ple/practice",
    condition: "ทำ 10 ข้อ",
  },
  {
    id: "daily_accuracy",
    title: "แม่นยำ 80%+",
    description: "ทำ 10 ข้อขึ้นไปและได้คะแนน ≥ 80%",
    icon: "🎯",
    type: "daily",
    xp: 100,
    href: "/ple/practice",
    condition: "80%+ ใน session เดียว",
  },
  {
    id: "daily_mock",
    title: "สอบ Mock วันนี้",
    description: "ทำ Mock Exam ให้เสร็จ 1 ชุด",
    icon: "📋",
    type: "daily",
    xp: 150,
    href: "/ple/mock",
    condition: "Mock 1 ชุด",
  },
];

const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: "week_streak_5",
    title: "5 วันติดต่อกัน",
    description: "ทำข้อสอบทุกวันติดต่อกัน 5 วัน",
    icon: "🔥",
    type: "weekly",
    xp: 300,
    href: "/ple/practice",
    condition: "Streak 5 วัน",
  },
  {
    id: "week_all_subjects",
    title: "ครบทุกสาขา",
    description: "ทำข้อสอบให้ครบอย่างน้อย 5 สาขาในสัปดาห์นี้",
    icon: "🌐",
    type: "weekly",
    xp: 500,
    href: "/ple/practice",
    condition: "5 สาขาขึ้นไปในสัปดาห์เดียว",
  },
  {
    id: "week_100",
    title: "100 ข้อในสัปดาห์",
    description: "ทำ MCQ รวมกันให้ได้ 100 ข้อภายในสัปดาห์",
    icon: "💯",
    type: "weekly",
    xp: 400,
    href: "/ple/practice",
    condition: "100 ข้อ/สัปดาห์",
  },
];

const SPECIAL_CHALLENGES: Challenge[] = [
  {
    id: "special_pharma_chem",
    title: "เภสัชเคมีมาสเตอร์",
    description: "ทำข้อสอบ เภสัชเคมี ≥ 50 ข้อ และได้คะแนน ≥ 70%",
    icon: "⚗️",
    type: "special",
    xp: 600,
    href: "/ple/practice?subject=pharma_chem",
    condition: "50 ข้อ + 70%+ ในสาขาเดียว",
  },
  {
    id: "special_pharm_law",
    title: "กฎหมายไม่ง้อจด",
    description: "ทำข้อสอบ กฎหมายเภสัชกรรม ≥ 30 ข้อ",
    icon: "⚖️",
    type: "special",
    xp: 400,
    href: "/ple/practice?subject=pharm_law",
    condition: "30 ข้อ กฎหมายเภสัชกรรม",
  },
  {
    id: "special_mock_pass",
    title: "ผ่าน Mock ครั้งแรก",
    description: "ทำ Mock Exam และได้คะแนน ≥ 60%",
    icon: "🏅",
    type: "special",
    xp: 800,
    href: "/ple/mock",
    condition: "Mock ≥ 60%",
  },
  {
    id: "special_500",
    title: "นักศึกษาจริงจัง",
    description: "ทำข้อสอบสะสมครบ 500 ข้อ",
    icon: "💊",
    type: "special",
    xp: 1000,
    href: "/ple/practice",
    condition: "สะสม 500 ข้อ",
    locked: true,
  },
];

const TYPE_LABEL: Record<string, string> = {
  daily: "ประจำวัน",
  weekly: "ประจำสัปดาห์",
  special: "พิเศษ",
};

const TYPE_COLOR: Record<string, string> = {
  daily: "bg-blue-100 text-blue-700",
  weekly: "bg-purple-100 text-purple-700",
  special: "bg-amber-100 text-amber-700",
};

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 gap-4 ${
        challenge.completed
          ? "bg-green-50 border-green-200"
          : challenge.locked
          ? "bg-muted/40 border-muted opacity-60"
          : "bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl shrink-0">{challenge.icon}</span>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="font-semibold text-sm">{challenge.title}</p>
            <Badge className={`text-[10px] ${TYPE_COLOR[challenge.type]}`}>
              {TYPE_LABEL[challenge.type]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{challenge.description}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            เงื่อนไข: {challenge.condition}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
          <Star className="h-3.5 w-3.5" /> +{challenge.xp} XP
        </span>
        {challenge.completed ? (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircle className="h-3.5 w-3.5" /> สำเร็จแล้ว
          </span>
        ) : challenge.locked ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> ยังล็อคอยู่
          </span>
        ) : (
          <Link href={challenge.href}>
            <Button size="sm" className="bg-brand hover:bg-brand-light text-white gap-1 text-xs">
              ลุยเลย <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" /> Challenges
        </h1>
        <p className="text-muted-foreground mt-1">
          ทำ Challenge สะสม XP เพื่อ Rank Up
        </p>
      </div>

      {/* XP note */}
      <Card className="mb-8 border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <Flame className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-800">XP คืออะไร?</p>
            <p className="text-amber-700/80 mt-0.5">
              XP วัดจากจำนวนข้อที่ทำสะสม ยิ่งทำมาก Rank ยิ่งสูง —
              Student นศภ. → Trainee → Pharmacist ภ.บ. → Specialist ภ.ม.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Daily */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">📅</span> Challenge ประจำวัน
            <Badge className="bg-blue-100 text-blue-700 ml-auto text-xs">รีเซ็ตทุกวัน</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {DAILY_CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </CardContent>
      </Card>

      {/* Weekly */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">📆</span> Challenge ประจำสัปดาห์
            <Badge className="bg-purple-100 text-purple-700 ml-auto text-xs">รีเซ็ตทุกจันทร์</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {WEEKLY_CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </CardContent>
      </Card>

      {/* Special */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="text-lg">🏆</span> Challenge พิเศษ
            <Badge className="bg-amber-100 text-amber-700 ml-auto text-xs">ทำได้ครั้งเดียว</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SPECIAL_CHALLENGES.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
