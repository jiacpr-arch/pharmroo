import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import GameRunner from "@/components/game/GameRunner";
import { getScenario } from "@/lib/game/load";
import { getGameXp } from "@/lib/db/queries-game";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** ค่าเดียวจาก query — array (พารามิเตอร์ซ้ำ) ถือว่าไม่ถูกต้อง */
function firstParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" && value ? value : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenario(slug);
  if (!scenario) return { title: "เกมร้านยา" };
  return {
    title: `${scenario.title} — เกมร้านยา`,
    description: scenario.subtitle,
  };
}

export default async function GamePlayPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const [scenario, session, sp] = await Promise.all([getScenario(slug), auth(), searchParams]);
  if (!scenario) notFound();

  const userId = session?.user?.id ?? null;
  const playerXp = userId ? await getGameXp(userId).catch(() => 0) : null;

  return (
    <GameRunner
      scenario={scenario}
      playerXp={playerXp}
      autostart={firstParam(sp.start) === "1"}
    />
  );
}
