import { auth } from "@/lib/auth";
import { saveMcqAttempt } from "@/lib/db/mutations-mcq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = await saveMcqAttempt({
    user_id: session.user.id,
    question_id: body.question_id,
    selected_answer: body.selected_answer,
    is_correct: body.is_correct,
    time_spent_seconds: body.time_spent_seconds ?? null,
    mode: body.mode || "practice",
    session_id: body.session_id ?? null,
  });

  if (!result) {
    return NextResponse.json({ error: "Failed to save attempt" }, { status: 500 });
  }
  return NextResponse.json(result);
}
