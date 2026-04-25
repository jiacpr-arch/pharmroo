import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getStudentStatsForAdmin } from "@/lib/db/queries-mcq";
import { getResend, fromEmail } from "@/lib/email/resend";
import { generateReportEmailHtml } from "@/lib/email/report-template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, userEmail, userName } = await req.json();
  if (!userId || !userEmail) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const [stats, targetUser] = await Promise.all([
    getStudentStatsForAdmin(userId),
    db
      .select({ exam_category: users.exam_category })
      .from(users)
      .where(eq(users.id, userId))
      .then((rows) => rows[0]),
  ]);
  if (stats.overall.total_attempts === 0) {
    return NextResponse.json({ error: "No data to report" }, { status: 400 });
  }

  const examCategory = targetUser?.exam_category ?? null;
  const examLabel = examCategory === "nursing" ? "NLE" : "PLE";

  const html = generateReportEmailHtml({
    userName: userName || "นักเรียน",
    overall: stats.overall,
    subjects: stats.subjects,
    weakAreas: stats.weakAreas,
    examCategory,
  });

  const { error } = await getResend().emails.send({
    from: fromEmail,
    to: userEmail,
    subject: `📊 รายงานผลข้อสอบ ${examLabel} — PharmRoo ภ.รู้`,
    html,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
