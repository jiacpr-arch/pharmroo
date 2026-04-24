"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shield, Loader2, BookOpen, CreditCard, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalExams: 0,
    totalUsers: 0,
    pendingPayments: 0,
    usersByCategory: { pharmacy: 0, nursing: 0, uncategorized: 0 },
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const user = session?.user as { role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setStatsLoading(false); });
  }, [isAdmin]);

  if (status === "loading" || statsLoading && isAdmin) {
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
        <p className="text-muted-foreground mt-2">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">จัดการระบบ PharmRoo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalExams}</p>
                <p className="text-sm text-muted-foreground">ข้อสอบทั้งหมด</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-muted-foreground">สมาชิก</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.pendingPayments > 0 ? "border-yellow-300" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                <p className="text-sm text-muted-foreground">รอตรวจสลิป</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">สมาชิกแยกตามสาย</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💊</span>
                <p className="text-2xl font-bold text-teal-700">{stats.usersByCategory.pharmacy}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">เภสัช (PLE)</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">💉</span>
                <p className="text-2xl font-bold text-rose-600">{stats.usersByCategory.nursing}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">พยาบาล (NLE)</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">❓</span>
                <p className="text-2xl font-bold text-gray-500">{stats.usersByCategory.uncategorized}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">ยังไม่ onboard</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-bold mb-4">จัดการ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/exams">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand" />
                <h3 className="font-bold">จัดการข้อสอบ</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">เพิ่ม แก้ไข ลบข้อสอบ MCQ</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/payments">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand" />
                  <h3 className="font-bold">ตรวจสลิปการชำระเงิน</h3>
                </div>
                {stats.pendingPayments > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    {stats.pendingPayments} รอตรวจ
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ตรวจสอบสลิปและอนุมัติสมาชิก</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand" />
                <h3 className="font-bold">จัดการสมาชิก</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ดูข้อมูลสมาชิก แก้ไขสมาชิกภาพ และกำหนดสิทธิ์</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
