import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { targetExam, dailyGoal, weakSubjects } = (await request.json()) as {
    targetExam: string;
    dailyGoal: number;
    weakSubjects: string[];
  };

  const examCategory: "pharmacy" | "nursing" | null =
    targetExam === "NLE" ? "nursing"
    : targetExam === "PLE-PC" || targetExam === "PLE-CC1" ? "pharmacy"
    : null;

  await db
    .update(users)
    .set({
      onboarding_done: true,
      target_exam: targetExam,
      exam_category: examCategory,
      daily_goal: dailyGoal,
      weak_subjects: weakSubjects,
    })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ ok: true });
}
