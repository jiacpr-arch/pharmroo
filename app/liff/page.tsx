"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ClipboardList,
  User,
  Crown,
  ArrowRight,
} from "lucide-react";

const membershipLabels: Record<string, string> = {
  free: "ฟรี",
  monthly: "รายเดือน",
  yearly: "รายปี",
};

const tiles = [
  {
    href: "/liff/practice",
    title: "ฝึกทำข้อสอบ",
    desc: "MCQ คละหมวด พร้อมเฉลย",
    icon: BookOpen,
  },
  {
    href: "/liff/mock",
    title: "สอบเสมือนจริง",
    desc: "ทำ Mock exam จับเวลา",
    icon: ClipboardList,
  },
  {
    href: "/liff/profile",
    title: "โปรไฟล์ของฉัน",
    desc: "สถานะสมาชิก + สถิติ",
    icon: User,
  },
  {
    href: "/liff/pricing",
    title: "อัปเกรดสมาชิก",
    desc: "ดูแพ็กเกจรายเดือน/รายปี",
    icon: Crown,
  },
];

export default function LiffHomePage() {
  const { data: session } = useSession();
  const user = session?.user as
    | { name?: string; membership_type?: string }
    | undefined;
  const membership = user?.membership_type || "free";

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">สวัสดี</p>
        <h1 className="text-2xl font-bold mt-0.5">{user?.name || "เพื่อนสมาชิก"}</h1>
        <div className="mt-2">
          <Badge variant="secondary" className="bg-brand/10 text-brand">
            สมาชิก: {membershipLabels[membership] || membership}
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link key={tile.href} href={tile.href} className="block">
              <Card className="transition hover:bg-muted/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg bg-brand/10 p-2.5 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold leading-tight">{tile.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tile.desc}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        PharmRoo Mini App
      </p>
    </div>
  );
}
