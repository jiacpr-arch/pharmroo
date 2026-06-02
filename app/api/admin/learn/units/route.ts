import { auth } from "@/lib/auth";
import { getAllUnitsWithLessons } from "@/lib/db/queries-learn";
import { getMcqSubjects } from "@/lib/db/queries-mcq";
import { createUnit } from "@/lib/db/mutations-learn";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  return role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const [units, subjects] = await Promise.all([
    getAllUnitsWithLessons(),
    getMcqSubjects(),
  ]);
  return NextResponse.json({ units, subjects });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  if (!body.title_th) {
    return NextResponse.json({ error: "Missing title_th" }, { status: 400 });
  }
  const unit = await createUnit({
    subject_id: body.subject_id ?? null,
    title_th: body.title_th,
    description_th: body.description_th ?? null,
    icon: body.icon,
    sort_order: body.sort_order,
    status: body.status,
  });
  return NextResponse.json(unit);
}
