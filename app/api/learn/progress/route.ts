import { auth } from "@/lib/auth";
import { upsertLessonProgress } from "@/lib/db/mutations-learn";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.lesson_id) {
    return NextResponse.json({ error: "Missing lesson_id" }, { status: 400 });
  }

  await upsertLessonProgress({
    user_id: session.user.id,
    lesson_id: body.lesson_id,
    status: "in_progress",
    last_card_index:
      typeof body.last_card_index === "number"
        ? body.last_card_index
        : undefined,
  });

  return NextResponse.json({ ok: true });
}
