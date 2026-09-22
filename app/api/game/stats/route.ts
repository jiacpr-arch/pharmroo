import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGameBests, getGameTotals } from "@/lib/db/queries-game";

// GET /api/game/stats — สรุปผลเกมของผู้ใช้ (dashboard / หน้ารวมเกม)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [totals, bests] = await Promise.all([
    getGameTotals(session.user.id),
    getGameBests(session.user.id),
  ]);
  return NextResponse.json({ ...totals, bests });
}
