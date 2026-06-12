import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { sendWelcomeEmail } from "@/lib/email";

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

  await db.insert(users).values({
    id: randomUUID(),
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

  return NextResponse.json({ success: true });
}
