import { auth } from "@/lib/auth";
import { createCard, reorderCards } from "@/lib/db/mutations-learn";
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
  if (!body.lesson_id) {
    return NextResponse.json({ error: "Missing lesson_id" }, { status: 400 });
  }
  const card = await createCard({
    lesson_id: body.lesson_id,
    card_type: body.card_type,
    title_th: body.title_th ?? null,
    body_md: body.body_md ?? "",
    image_url: body.image_url ?? null,
  });
  return NextResponse.json(card);
}

/** PATCH — reorder cards within a lesson. Body: { lesson_id, ordered_ids: string[] }. */
export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  if (!body.lesson_id || !Array.isArray(body.ordered_ids)) {
    return NextResponse.json(
      { error: "Missing lesson_id or ordered_ids" },
      { status: 400 }
    );
  }
  await reorderCards(body.lesson_id, body.ordered_ids as string[]);
  return NextResponse.json({ ok: true });
}
