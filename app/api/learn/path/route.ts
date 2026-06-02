import { auth } from "@/lib/auth";
import { getLearningPath, getContinueLesson } from "@/lib/db/queries-learn";
import type { ExamCategory } from "@/lib/db/queries-mcq";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const examCategory = (session.user as { exam_category?: string | null })
    .exam_category as ExamCategory | null | undefined;

  const [units, continueLesson] = await Promise.all([
    getLearningPath(session.user.id, examCategory ?? undefined),
    getContinueLesson(session.user.id),
  ]);

  return NextResponse.json({ units, continueLesson });
}
