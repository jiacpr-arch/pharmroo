// อ่านผลเกมร้านยาของผู้ใช้ — server-only (ใช้ใน page/route)

import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { gameRuns } from "@/lib/db/schema";
import type { Grade } from "@/lib/game/types";

export interface GameBest {
  grade: Grade;
  score: number;
  runs: number;
}

const GRADE_ORDER: Record<Grade, number> = { S: 4, A: 3, B: 2, C: 1 };

/** เกรด/คะแนนดีสุดต่อเคส + จำนวนรอบ */
export async function getGameBests(userId: string): Promise<Record<string, GameBest>> {
  const rows = await db
    .select({
      slug: gameRuns.scenario_slug,
      grade: gameRuns.grade,
      score: gameRuns.score,
    })
    .from(gameRuns)
    .where(eq(gameRuns.user_id, userId));

  const out: Record<string, GameBest> = {};
  for (const r of rows) {
    const cur = out[r.slug];
    if (!cur) {
      out[r.slug] = { grade: r.grade, score: r.score, runs: 1 };
      continue;
    }
    cur.runs += 1;
    if (GRADE_ORDER[r.grade] > GRADE_ORDER[cur.grade] || (r.grade === cur.grade && r.score > cur.score)) {
      cur.grade = r.grade;
      cur.score = r.score;
    }
  }
  return out;
}

export interface GameTotals {
  played: number;
  wins: number;
  xp: number;
}

export async function getGameTotals(userId: string): Promise<GameTotals> {
  const [row] = await db
    .select({
      played: sql<number>`count(*)`,
      wins: sql<number>`coalesce(sum(case when ${gameRuns.won} then 1 else 0 end), 0)`,
      xp: sql<number>`coalesce(sum(${gameRuns.xp}), 0)`,
    })
    .from(gameRuns)
    .where(eq(gameRuns.user_id, userId));
  return {
    played: Number(row?.played ?? 0),
    wins: Number(row?.wins ?? 0),
    xp: Number(row?.xp ?? 0),
  };
}

/** XP สะสมของเกม — ใช้โชว์ยศบนจอ title */
export async function getGameXp(userId: string): Promise<number> {
  return (await getGameTotals(userId)).xp;
}

/** เงื่อนไข badge — ใช้ทั้งตอนบันทึกผลและตอน claim ผ่าน /api/challenges */
export async function countGameRuns(
  userId: string,
  filter: "won" | "grade_s" | "no_mistake",
): Promise<number> {
  const cond =
    filter === "won"
      ? eq(gameRuns.won, true)
      : filter === "grade_s"
        ? and(eq(gameRuns.won, true), eq(gameRuns.grade, "S"))
        : and(eq(gameRuns.won, true), eq(gameRuns.wrong_count, 0), sql`${gameRuns.difficulty} <> 'easy'`);
  const [row] = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(gameRuns)
    .where(and(eq(gameRuns.user_id, userId), cond));
  return Number(row?.cnt ?? 0);
}

export async function getRecentGameRuns(userId: string, limit = 10) {
  return db
    .select({
      slug: gameRuns.scenario_slug,
      won: gameRuns.won,
      grade: gameRuns.grade,
      score: gameRuns.score,
      xp: gameRuns.xp,
      created_at: gameRuns.created_at,
    })
    .from(gameRuns)
    .where(eq(gameRuns.user_id, userId))
    .orderBy(desc(gameRuns.created_at))
    .limit(limit);
}
