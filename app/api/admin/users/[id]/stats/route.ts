import { auth } from "@/lib/auth";
import { getStudentStatsForAdmin } from "@/lib/db/queries-mcq";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const stats = await getStudentStatsForAdmin(id);
  return NextResponse.json(stats);
}
