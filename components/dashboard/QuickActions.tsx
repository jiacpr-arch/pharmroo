"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Trophy, Package, ChevronRight } from "lucide-react";

const actions = [
  {
    href: "/ple/practice",
    icon: Zap,
    iconBg: "bg-brand/10",
    iconColor: "text-brand",
    title: "ฝึกทำข้อสอบ",
    desc: "เลือกวิชา ทำแบบไม่มีเวลา",
    gradient: "from-teal-50 to-white",
    border: "border-brand/20",
  },
  {
    href: "/ple/mock",
    icon: Trophy,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "สอบจำลอง PLE",
    desc: "เหมือนสอบจริง มีจับเวลา",
    gradient: "from-purple-50 to-white",
    border: "border-purple-200",
  },
  {
    href: "/sets",
    icon: Package,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "ชุดข้อสอบ",
    desc: "ข้อสอบเฉพาะวิชา / ราย set",
    gradient: "from-amber-50 to-white",
    border: "border-amber-200",
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">เริ่มเลย</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href}>
              <Card
                className={`border ${a.border} bg-gradient-to-br ${a.gradient} hover:shadow-md transition-shadow cursor-pointer group`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${a.iconBg} flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${a.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
