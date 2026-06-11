"use client";

import { useEffect, useState } from "react";
import {
  Search,
  FlaskConical,
  BookOpen,
  MessageCircle,
  Lightbulb,
  Stethoscope,
  User,
  Globe,
  HeartPulse,
  LifeBuoy,
  Activity,
  Siren,
  Pill,
  GraduationCap,
  Bandage,
  Zap,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

type Ad = {
  domain: string;
  url: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  accent: string;
};

const ADS: Ad[] = [
  {
    domain: "morroo.com",
    url: "https://www.morroo.com",
    title: "หมอรู้ (Morroo)",
    tagline: "รวมความรู้สุขภาพและการแพทย์",
    icon: Stethoscope,
    accent: "text-teal-600",
  },
  {
    domain: "cpr.morroo.com",
    url: "https://cpr.morroo.com",
    title: "CPR หมอรู้",
    tagline: "เรียนรู้การช่วยฟื้นคืนชีพ (CPR)",
    icon: HeartPulse,
    accent: "text-red-600",
  },
  {
    domain: "bls.morroo.com",
    url: "https://bls.morroo.com",
    title: "BLS หมอรู้",
    tagline: "หลักสูตร Basic Life Support",
    icon: LifeBuoy,
    accent: "text-orange-600",
  },
  {
    domain: "acls.morroo.com",
    url: "https://acls.morroo.com",
    title: "ACLS หมอรู้",
    tagline: "หลักสูตร ACLS สำหรับบุคลากรการแพทย์",
    icon: Activity,
    accent: "text-pink-600",
  },
  {
    domain: "emr.morroo.com",
    url: "https://emr.morroo.com",
    title: "EMR หมอรู้",
    tagline: "หลักสูตรผู้ปฏิบัติการฉุกเฉินการแพทย์",
    icon: Siren,
    accent: "text-sky-600",
  },
  {
    domain: "drug.morroo.com",
    url: "https://drug.morroo.com",
    title: "Drug หมอรู้",
    tagline: "ข้อมูลยาและการใช้ยา",
    icon: Pill,
    accent: "text-cyan-600",
  },
  {
    domain: "pharma.morroo.com",
    url: "https://pharma.morroo.com",
    title: "Pharma หมอรู้",
    tagline: "ความรู้เภสัชวิทยา",
    icon: GraduationCap,
    accent: "text-violet-600",
  },
  {
    domain: "firstaid.morroo.com",
    url: "https://firstaid.morroo.com",
    title: "First Aid หมอรู้",
    tagline: "การปฐมพยาบาลเบื้องต้น",
    icon: Bandage,
    accent: "text-green-600",
  },
  {
    domain: "icd10.morroo.com",
    url: "https://icd10.morroo.com",
    title: "ICD-10 ค้นรหัสโรค",
    tagline: "ค้นรหัส ICD-10 ภาษาไทย ใช้ฟรี",
    icon: Search,
    accent: "text-indigo-600",
  },
  {
    domain: "lab.morroo.com",
    url: "https://lab.morroo.com",
    title: "Lab Values",
    tagline: "แปลผลตรวจทางห้องปฏิบัติการ",
    icon: FlaskConical,
    accent: "text-emerald-600",
  },
  {
    domain: "pocket.morroo.com",
    url: "https://pocket.morroo.com",
    title: "Pocket หมอรู้",
    tagline: "คู่มือพกพาสำหรับบุคลากรการแพทย์",
    icon: BookOpen,
    accent: "text-amber-600",
  },
  {
    domain: "advice.morroo.com",
    url: "https://advice.morroo.com",
    title: "คำแนะนำผู้ป่วย",
    tagline: "ใบให้คำแนะนำผู้ป่วยพร้อมใช้ในคลินิก",
    icon: MessageCircle,
    accent: "text-rose-600",
  },
  {
    domain: "roodee.me",
    url: "https://roodee.me",
    title: "รู้ดี (Roodee)",
    tagline: "ความรู้สุขภาพย่อยง่าย อ่านสนุก",
    icon: Lightbulb,
    accent: "text-yellow-600",
  },
  {
    domain: "jiacpr.com",
    url: "https://jiacpr.com",
    title: "JiaCPR",
    tagline: "บล็อกและงานเขียนของหมอเจี่ย",
    icon: User,
    accent: "text-purple-600",
  },
  {
    domain: "jiaaed.com",
    url: "https://jiaaed.com",
    title: "JiaAED",
    tagline: "ความรู้และการใช้เครื่อง AED",
    icon: Zap,
    accent: "text-lime-600",
  },
  {
    domain: "jia1669.com",
    url: "https://jia1669.com",
    title: "Jia1669",
    tagline: "เว็บไซต์ส่วนตัวของหมอเจี่ย",
    icon: Globe,
    accent: "text-slate-600",
  },
];

const ROTATE_MS = 6000;

export default function AdBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ADS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const ad = ADS[index];
  const Icon = ad.icon;

  return (
    <div
      className="border-b bg-gradient-to-r from-slate-50 via-white to-slate-50"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline">
          เว็บในเครือ
        </span>
        <a
          key={ad.domain}
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-label={`${ad.title} — ${ad.domain}`}
          className="group flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
        >
          <Icon className={`h-4 w-4 shrink-0 ${ad.accent}`} />
          <span className="truncate">
            <span className="font-semibold text-foreground">{ad.title}</span>
            <span className="mx-2 text-muted-foreground/40">·</span>
            <span className="text-muted-foreground">{ad.tagline}</span>
            <span className="ml-2 hidden font-mono text-xs text-muted-foreground/70 md:inline">
              {ad.domain}
            </span>
          </span>
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <div className="hidden shrink-0 items-center gap-1 sm:flex" role="tablist" aria-label="เลือกเว็บไซต์ในเครือ">
          {ADS.map((a, i) => (
            <button
              key={a.domain}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={a.domain}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-4 bg-teal-600" : "w-1 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
