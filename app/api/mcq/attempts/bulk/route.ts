import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { mcqAttempts } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { session_id, attempts } = body as {
    session_id: string;
    attempts: Array<{
      question_id: string;
      selected_answer: string;
      is_correct: boolean;
      time_spent_seconds?: number | null;
    }>;
  };

  if (!attempts?.length) {
    return NextResponse.json({ error: "No attempts" }, { status: 400 });
  }

  const values = attempts.map((a) => ({
    id: crypto.randomUUID(),
    user_id: session.user!.id,
    question_id: a.question_id,
    selected_answer: a.selected_answer,
    is_correct: a.is_correct,
    time_spent_seconds: a.time_spent_seconds ?? null,
    mode: "mock" as const,
    session_id,
  }));

  await db.insert(mcqAttempts).values(values);

  return NextResponse.json({ inserted: values.length });
}
