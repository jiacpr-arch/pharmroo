"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Mail, Crown, Calendar, LogOut, BarChart3, ArrowRight } from "lucide-react";
import StudentStats from "@/components/StudentStats";

const membershipLabels: Record<string, string> = {
  free: "ฟรี",
  monthly: "รายเดือน",
  yearly: "รายปี",
};

const membershipColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  monthly: "bg-brand/10 text-brand",
  yearly: "bg-amber-100 text-amber-700",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as {
    name?: string;
    email?: string;
    role?: string;
    membership_type?: string;
    membership_expires_at?: string | null;
  };

  const membershipType = user.membership_type || "free";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">โปรไฟล์</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
                <User className="h-8 w-8 text-brand" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name || "ผู้ใช้งาน"}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold flex items-center gap-2">
              <Crown className="h-5 w-5 text-brand" /> สถานะสมาชิก
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">แพ็กเกจ</span>
              <Badge className={membershipColors[membershipType] || membershipColors.free}>
                {membershipLabels[membershipType] || membershipType}
              </Badge>
            </div>
            {user.membership_expires_at && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> วันหมดอายุ
                </span>
                <span className="text-sm font-medium">
                  {new Date(user.membership_expires_at).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {membershipType === "free" && (
              <Link href="/pricing">
                <Button className="w-full bg-brand hover:bg-brand-light text-white mt-2">
                  อัปเกรดแพ็กเกจ
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Student Stats Dashboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand" /> ผลการทำข้อสอบ
            </h3>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-1 text-brand border-brand/30">
                ดูแบบละเอียด <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <StudentStats />
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" /> ออกจากระบบ
        </Button>
      </div>
    </div>
  );
}
