import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGameTotals } from "@/lib/db/queries-game";
import { awardGameBadge, insertGameRun } from "@/lib/db/mutations-game";
import { parseRunInput } from "@/lib/game/run-input";
import { GAME_SCENARIO_SLUGS } from "@/lib/game/scenarios";
import { GAME_BADGES } from "@/lib/game/xp";

// POST /api/game/run — บันทึกผลการเล่น 1 รอบ (ต้องล็อกอิน)
// XP คำนวณฝั่งนี้เสมอ; badge ใช้ user_challenges เหมือน challenge อื่นของแอป
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const input = parseRunInput(body, GAME_SCENARIO_SLUGS);
  if (!input) {
    return NextResponse.json({ error: "Invalid run payload" }, { status: 400 });
  }

  const before = await getGameTotals(userId);
  const xpEarned = await insertGameRun(userId, input);

  const newBadges: string[] = [];
  if (input.won) {
    if (await awardGameBadge(userId, GAME_BADGES.firstWin)) newBadges.push(GAME_BADGES.firstWin);
    if (input.grade === "S" && (await awardGameBadge(userId, GAME_BADGES.gradeS))) {
      newBadges.push(GAME_BADGES.gradeS);
    }
    if (input.wrong === 0 && input.difficulty !== "easy" && (await awardGameBadge(userId, GAME_BADGES.noMistake))) {
      newBadges.push(GAME_BADGES.noMistake);
    }
  }

  return NextResponse.json({
    xpEarned,
    newBadges,
    xpBefore: before.xp,
    xpAfter: before.xp + xpEarned,
  });
}
