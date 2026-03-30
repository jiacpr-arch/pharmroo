import { auth } from "@/lib/auth";
import { getStudentStatsForAdmin } from "@/lib/db/queries-mcq";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = await getStudentStatsForAdmin(session.user.id);
  return NextResponse.json(stats);
}
