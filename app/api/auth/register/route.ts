import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sendWelcomeEmail } from "@/lib/email";
import { sendMetaConversionEvent } from "@/lib/analytics/meta-capi";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
      { status: 400 }
    );
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .then(rows => rows[0]);

  if (existing) {
    return NextResponse.json({ error: "อีเมลนี้ถูกใช้แล้ว" }, { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const userId = randomUUID();
  await db.insert(users).values({
    id: userId,
    email,
    name,
    password_hash,
    role: "user",
    membership_type: "free",
  });

  // Fire-and-forget welcome email — never block / fail registration on it.
  sendWelcomeEmail({ email, name }).catch((err) =>
    console.error("[register] welcome email error:", err)
  );

  // Fire-and-forget server-side Meta CompleteRegistration. The browser pixel
  // fires the same event with eventID=userId, so Meta de-duplicates the two.
  const firstForwarded = (req.headers.get("x-forwarded-for") ?? "")
    .split(",")[0]
    .trim();
  sendMetaConversionEvent({
    eventName: "CompleteRegistration",
    eventId: userId,
    eventSourceUrl: req.headers.get("referer") ?? undefined,
    userData: {
      email,
      externalId: userId,
      fbp: req.cookies.get("_fbp")?.value,
      fbc: req.cookies.get("_fbc")?.value,
      clientIpAddress: firstForwarded || undefined,
      clientUserAgent: req.headers.get("user-agent") ?? undefined,
    },
  }).catch((err) => console.error("[register] meta capi error:", err));

  // eventId lets the client de-duplicate its CompleteRegistration pixel event.
  return NextResponse.json({ success: true, eventId: userId });
}
