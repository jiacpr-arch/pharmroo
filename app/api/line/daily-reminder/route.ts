import { NextRequest, NextResponse } from "next/server";
import { broadcastLineMessages } from "@/lib/line";

export const runtime = "nodejs";

function verifyCron(request: NextRequest): boolean {
  const auth = request.headers.get("authorization") ?? "";
  const secret = request.nextUrl.searchParams.get("secret");
  return (
    auth === `Bearer ${process.env.CRON_SECRET}` ||
    secret === process.env.BLOG_GENERATE_SECRET
  );
}

export async function POST(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await broadcastLineMessages([
      {
        type: "text",
        text: "สวัสดีตอนเช้าครับ 🌅\nวันนี้มีข้อสอบ PLE/NLE รอน้องอยู่นะครับ\nทำข้อสอบวันละนิด เตรียมพร้อมรับใบประกอบวิชาชีพ 💊\n\nhttps://pharmroo.com",
      },
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[line/daily-reminder]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
