"use client";

import Link from "next/link";
import { Zap, Trophy, Package, ArrowRight } from "lucide-react";

const actions = [
  {
    href: "/ple/practice",
    icon: Zap,
    bg: "bg-gradient-to-br from-teal-500 to-teal-700",
    shadow: "shadow-teal-200",
    iconBg: "bg-white/20",
    title: "ฝึกทำข้อสอบ",
    desc: "เลือกวิชา ทำแบบไม่มีเวลา",
    tag: "Practice",
  },
  {
    href: "/ple/mock",
    icon: Trophy,
    bg: "bg-gradient-to-br from-purple-500 to-purple-700",
    shadow: "shadow-purple-200",
    iconBg: "bg-white/20",
    title: "สอบจำลอง PLE",
    desc: "เหมือนสอบจริง มีจับเวลา",
    tag: "Mock Exam",
  },
  {
    href: "/sets",
    icon: Package,
    bg: "bg-gradient-to-br from-amber-500 to-orange-600",
    shadow: "shadow-amber-200",
    iconBg: "bg-white/20",
    title: "ชุดข้อสอบ",
    desc: "ข้อสอบเฉพาะวิชา / ราย set",
    tag: "Sets",
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-base font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        เริ่มเลย
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href}>
              <div
                className={`${a.bg} ${a.shadow} text-white rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${a.iconBg} rounded-xl p-2.5`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-semibold bg-white/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                    {a.tag}
                  </span>
                </div>
                <p className="font-bold text-lg leading-tight">{a.title}</p>
                <p className="text-sm text-white/75 mt-0.5">{a.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-white/80 text-xs font-medium group-hover:gap-2 transition-all">
                  เริ่มเลย <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
