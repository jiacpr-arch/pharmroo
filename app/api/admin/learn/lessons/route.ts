import { auth } from "@/lib/auth";
import { createLesson } from "@/lib/db/mutations-learn";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin";
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  if (!body.unit_id || !body.title_th) {
    return NextResponse.json(
      { error: "Missing unit_id or title_th" },
      { status: 400 }
    );
  }
  const lesson = await createLesson({
    unit_id: body.unit_id,
    title_th: body.title_th,
    subtitle_th: body.subtitle_th ?? null,
    icon: body.icon,
    sort_order: body.sort_order,
    est_minutes: body.est_minutes,
    xp_reward: body.xp_reward,
    quiz_count: body.quiz_count,
    status: body.status,
  });
  return NextResponse.json(lesson);
}
