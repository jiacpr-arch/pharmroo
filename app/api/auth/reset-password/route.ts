import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { passwordResetTokens, users } from "@/lib/db/schema";
import {
  formatDbTimestamp,
  hashResetToken,
  MIN_PASSWORD_LENGTH,
} from "@/lib/password-reset";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token || !password) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร` },
      { status: 400 }
    );
  }

  const now = formatDbTimestamp(new Date());
  const password_hash = await bcrypt.hash(password, 10);

  // Atomically consume the token so a link can't be replayed concurrently.
  const consumed = await db
    .update(passwordResetTokens)
    .set({ used_at: now })
    .where(
      and(
        eq(passwordResetTokens.token_hash, hashResetToken(token)),
        isNull(passwordResetTokens.used_at),
        gt(passwordResetTokens.expires_at, now)
      )
    )
    .returning({ user_id: passwordResetTokens.user_id });

  if (consumed.length === 0) {
    return NextResponse.json(
      { error: "ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่" },
      { status: 400 }
    );
  }

  await db
    .update(users)
    .set({ password_hash })
    .where(eq(users.id, consumed[0].user_id));

  return NextResponse.json({ success: true });
}
