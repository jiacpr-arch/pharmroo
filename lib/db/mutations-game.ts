// เขียนผลเกมร้านยา + แจก badge — server-only

import { db } from "@/lib/db";
import { gameRuns, userChallenges } from "@/lib/db/schema";
import type { LocalRun } from "@/lib/game/local-progress";
import type { RunInput } from "@/lib/game/run-input";
import { xpForRun } from "@/lib/game/xp";

export async function insertGameRun(userId: string, input: RunInput): Promise<number> {
  const xp = xpForRun(input.won, input.grade);
  await db.insert(gameRuns).values({
    user_id: userId,
    scenario_slug: input.slug,
    difficulty: input.difficulty as "easy" | "normal" | "hard",
    won: input.won,
    grade: input.grade,
    score: input.score,
    wrong_count: input.wrong,
    duration_sec: input.durationSec,
    xp,
    metrics: {
      timeline: input.timeline,
      referred: input.referred,
      dispensed: input.dispensed,
    },
  });
  return xp;
}

/** ยกประวัติที่เล่นตอนยังไม่ล็อกอินเข้าบัญชี — XP คำนวณใหม่จากเกรด ไม่เชื่อค่าจากเครื่อง */
export async function insertClaimedRuns(userId: string, runs: LocalRun[]): Promise<number> {
  if (runs.length === 0) return 0;
  await db.insert(gameRuns).values(
    runs.map((r) => ({
      user_id: userId,
      scenario_slug: r.slug,
      difficulty: r.difficulty as "easy" | "normal" | "hard",
      won: r.won,
      grade: r.grade,
      score: r.score,
      wrong_count: 0,
      duration_sec: 0,
      xp: xpForRun(r.won, r.grade),
      metrics: { claimed_from_local: true, played_at: r.at },
    })),
  );
  return runs.length;
}

/** true เมื่อเพิ่งได้ badge นี้ครั้งแรก (เคยมีแล้ว = false) */
export async function awardGameBadge(userId: string, challengeId: string): Promise<boolean> {
  const inserted = await db
    .insert(userChallenges)
    .values({ user_id: userId, challenge_id: challengeId })
    .onConflictDoNothing()
    .returning({ id: userChallenges.id });
  return inserted.length > 0;
}
