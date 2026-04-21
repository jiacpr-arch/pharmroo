import { auth } from "@/lib/auth";
import { createMcqSession, updateMcqSession } from "@/lib/db/mutations-mcq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const allowedExamTypes = ["PLE-PC", "PLE-CC1", "NLE"] as const;
  const examType = allowedExamTypes.includes(body.exam_type)
    ? body.exam_type
    : "PLE-CC1";

  const result = await createMcqSession({
    user_id: session.user.id,
    mode: body.mode || "practice",
    exam_type: examType,
    exam_day: body.exam_day ?? null,
    subject_id: body.subject_id ?? null,
    total_questions: body.total_questions,
    time_limit_minutes: body.time_limit_minutes ?? null,
  });

  if (!result) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "Missing session id" }, { status: 400 });
  }

  const result = await updateMcqSession(body.id, {
    correct_count: body.correct_count,
    completed_at: body.completed_at,
  });

  if (!result) {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
  return NextResponse.json(result);
}
