"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      } else {
        setSent(true);
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="text-4xl">🔑</div>
          <h1 className="text-2xl font-bold">ลืมรหัสผ่าน</h1>
          <p className="text-sm text-muted-foreground">
            กรอกอีเมลที่ใช้สมัคร เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <div className="space-y-2 text-center text-sm">
              <p className="font-medium">ส่งคำขอเรียบร้อยแล้ว</p>
              <p className="text-muted-foreground">
                หากอีเมลนี้มีบัญชีอยู่ในระบบ คุณจะได้รับลิงก์ตั้งรหัสผ่านใหม่ภายในไม่กี่นาที
                (ลิงก์ใช้ได้ 1 ชั่วโมง) โปรดตรวจสอบโฟลเดอร์สแปมด้วย
              </p>
              <p className="text-muted-foreground">
                หากสมัครด้วย Google หรือ LINE ให้เข้าสู่ระบบด้วยปุ่มนั้นได้เลย
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-brand hover:bg-brand-light text-white"
                disabled={loading}
              >
                {loading ? "กำลังส่ง..." : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/login" className="text-sm text-brand font-medium hover:underline">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
