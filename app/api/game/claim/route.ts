import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { insertClaimedRuns } from "@/lib/db/mutations-game";
import { parseClaimInput } from "@/lib/game/run-input";
import { GAME_SCENARIO_SLUGS } from "@/lib/game/scenarios";

// POST /api/game/claim — ยกผลที่เล่นตอนยังไม่ล็อกอิน (localStorage) เข้าบัญชี
// client ล้างของในเครื่องก่อนยิง จึงยกซ้ำไม่ได้ (ดู lib/game/record.ts)
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const runs = parseClaimInput(body, GAME_SCENARIO_SLUGS);
  const claimed = await insertClaimedRuns(session.user.id, runs);
  return NextResponse.json({ claimed });
}
