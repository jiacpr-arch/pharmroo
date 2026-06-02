import { auth } from "@/lib/auth";
import { getLessonById, getLessonCards } from "@/lib/db/queries-learn";
import { updateLesson, deleteLesson } from "@/lib/db/mutations-learn";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin";
}

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
  const cards = await getLessonCards(id);
  return NextResponse.json({ lesson, cards });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  await updateLesson(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await deleteLesson(id);
  return NextResponse.json({ ok: true });
}
