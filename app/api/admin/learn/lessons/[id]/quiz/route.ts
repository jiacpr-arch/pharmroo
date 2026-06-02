import { auth } from "@/lib/auth";
import { getLessonById, getUnitWithLessons } from "@/lib/db/queries-learn";
import { getMcqQuestions } from "@/lib/db/queries-mcq";
import { setLessonQuizQuestions, updateLesson } from "@/lib/db/mutations-learn";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin";
}

/** GET — candidate questions for the lesson's subject (to attach to the quiz). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const lesson = await getLessonById(id);
  if (!lesson)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const unit = await getUnitWithLessons(lesson.unit_id);
  const questions = unit?.subject_id
    ? await getMcqQuestions({ subjectId: unit.subject_id, limit: 100 })
    : [];

  return NextResponse.json({
    selected: lesson.quiz_question_ids,
    quiz_count: lesson.quiz_count,
    candidates: questions.map((q) => ({
      id: q.id,
      scenario: q.scenario.slice(0, 160),
      difficulty: q.difficulty,
    })),
  });
}

/** PATCH — set the explicit quiz_question_ids and/or the fallback quiz_count. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();

  if (Array.isArray(body.quiz_question_ids)) {
    await setLessonQuizQuestions(id, body.quiz_question_ids as string[]);
  }
  if (typeof body.quiz_count === "number") {
    await updateLesson(id, { quiz_count: body.quiz_count });
  }
  return NextResponse.json({ ok: true });
}
