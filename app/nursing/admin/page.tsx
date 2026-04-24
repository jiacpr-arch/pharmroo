"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shield, Loader2, BookOpen, Users, LayoutDashboard, Users2 } from "lucide-react";

type Stats = {
  totalQuestions: number;
  totalSubjects: number;
  totalNursingUsers: number;
};

export default function NursingAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalQuestions: 0, totalSubjects: 0, totalNursingUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAuthorized = role === "nursing_admin" || role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/nursing/admin");
  }, [status, router]);

  useEffect(() => {
    if (!isAuthorized) return;
    fetch("/api/nursing-admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [isAuthorized]);

  if (status === "loading" || (statsLoading && isAuthorized)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-muted-foreground mt-2">หน้านี้สำหรับ Nursing Admin เท่านั้น</p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="outline">กลับหน้าหลัก</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-rose-100 text-rose-700">NLE Admin</Badge>
          </div>
          <h1 className="text-2xl font-bold">Nursing Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">จัดการระบบข้อสอบ NLE (สภาการพยาบาล)</p>
        </div>
        {role === "admin" && (
          <Link href="/admin">
            <Button variant="outline" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Admin หลัก
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalQuestions}</p>
                <p className="text-sm text-muted-foreground">ข้อสอบ NLE ทั้งหมด</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSubjects}</p>
                <p className="text-sm text-muted-foreground">สาขาวิชา NLE</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalNursingUsers}</p>
                <p className="text-sm text-muted-foreground">ผู้ใช้สายพยาบาล</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-bold mb-4">จัดการ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/nursing/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users2 className="h-5 w-5 text-rose-600" />
                <h3 className="font-bold">จัดการสมาชิกสายพยาบาล</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ดูและแก้ไขสมาชิกที่เลือก NLE</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/nursing">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-rose-600" />
                <h3 className="font-bold">ดูหน้าข้อสอบ NLE</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ดูหน้าฝึกสอบและจำลองสอบ NLE ที่นักเรียนเห็น</p>
            </CardContent>
          </Card>
        </Link>
        <Card className="h-full opacity-60">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-bold text-muted-foreground">จัดการข้อสอบ NLE</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">เพิ่ม แก้ไข ลบข้อสอบ MCQ (กำลังพัฒนา)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
