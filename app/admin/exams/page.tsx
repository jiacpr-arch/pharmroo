"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2, BookOpen, ArrowLeft } from "lucide-react";

export default function AdminExamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user as { role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-6">
        <ArrowLeft className="h-4 w-4" /> Admin Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6">จัดการข้อสอบ MCQ</h1>
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">ระบบจัดการข้อสอบ MCQ กำลังพัฒนา</p>
          <p className="text-sm text-muted-foreground">สามารถเพิ่มข้อสอบผ่าน Turso dashboard หรือ seed script ได้ก่อน</p>
          <Link href="/admin">
            <Button variant="outline">กลับ Admin Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
