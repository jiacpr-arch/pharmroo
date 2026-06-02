import { auth } from "@/lib/auth";
import { getLessonForPlayer, isLessonUnlocked } from "@/lib/db/queries-learn";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;
  const data = await getLessonForPlayer(lessonId, session.user.id);
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (data.lesson.status !== "published") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const unlocked = await isLessonUnlocked(lessonId, session.user.id);
  if (!unlocked) {
    return NextResponse.json({ error: "Locked" }, { status: 403 });
  }

  return NextResponse.json(data);
}
