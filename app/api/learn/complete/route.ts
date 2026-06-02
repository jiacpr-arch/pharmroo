import { auth } from "@/lib/auth";
import { completeLessonProgress } from "@/lib/db/mutations-learn";
import { getLessonById } from "@/lib/db/queries-learn";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.lesson_id) {
    return NextResponse.json({ error: "Missing lesson_id" }, { status: 400 });
  }

  const lesson = await getLessonById(body.lesson_id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  await completeLessonProgress({
    user_id: session.user.id,
    lesson_id: body.lesson_id,
    score: typeof body.score === "number" ? body.score : 0,
    quiz_total: typeof body.quiz_total === "number" ? body.quiz_total : 0,
  });

  return NextResponse.json({ ok: true, xp_reward: lesson.xp_reward });
}
