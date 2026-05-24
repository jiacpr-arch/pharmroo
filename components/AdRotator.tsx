"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  FlaskConical,
  BookOpen,
  MessageCircle,
  Lightbulb,
  Stethoscope,
  User,
  Globe,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

type Ad = {
  domain: string;
  url: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
};

const ADS: Ad[] = [
  {
    domain: "emr.morroo.com",
    url: "https://emr.morroo.com",
    title: "EMR หมอรู้",
    tagline: "เวชระเบียนอิเล็กทรอนิกส์สำหรับคลินิก ใช้งานง่าย",
    icon: FileText,
    gradient: "from-sky-50 to-blue-50 border-sky-200",
    iconColor: "text-sky-600",
  },
  {
    domain: "icd10.morroo.com",
    url: "https://icd10.morroo.com",
    title: "ICD-10 ค้นรหัสโรค",
    tagline: "ค้นรหัส ICD-10 ภาษาไทย รวดเร็ว ใช้ฟรี",
    icon: Search,
    gradient: "from-indigo-50 to-violet-50 border-indigo-200",
    iconColor: "text-indigo-600",
  },
  {
    domain: "lab.morroo.com",
    url: "https://lab.morroo.com",
    title: "Lab Values",
    tagline: "ค่าผลตรวจทางห้องปฏิบัติการ เทียบช่วงปกติได้ทันที",
    icon: FlaskConical,
    gradient: "from-emerald-50 to-teal-50 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    domain: "pocket.morroo.com",
    url: "https://pocket.morroo.com",
    title: "Pocket หมอรู้",
    tagline: "คู่มือพกพาสำหรับบุคลากรการแพทย์ เปิดดูได้ทุกที่",
    icon: BookOpen,
    gradient: "from-amber-50 to-orange-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    domain: "advice.morroo.com",
    url: "https://advice.morroo.com",
    title: "คำแนะนำผู้ป่วย",
    tagline: "ใบให้คำแนะนำผู้ป่วยภาษาไทย พร้อมใช้งานในคลินิก",
    icon: MessageCircle,
    gradient: "from-rose-50 to-pink-50 border-rose-200",
    iconColor: "text-rose-600",
  },
  {
    domain: "roodee.me",
    url: "https://roodee.me",
    title: "รู้ดี (Roodee)",
    tagline: "ความรู้สุขภาพย่อยง่าย อ่านสนุก รู้ลึก รู้ดี",
    icon: Lightbulb,
    gradient: "from-yellow-50 to-amber-50 border-yellow-200",
    iconColor: "text-yellow-600",
  },
  {
    domain: "morroo.com",
    url: "https://morroo.com",
    title: "หมอรู้ (Morroo)",
    tagline: "แพลตฟอร์มเครื่องมือดิจิทัลสำหรับบุคลากรการแพทย์",
    icon: Stethoscope,
    gradient: "from-teal-50 to-cyan-50 border-teal-200",
    iconColor: "text-teal-600",
  },
  {
    domain: "jiacpr.com",
    url: "https://jiacpr.com",
    title: "JiaCPR",
    tagline: "บล็อกและงานเขียนของหมอเจี่ย",
    icon: User,
    gradient: "from-purple-50 to-fuchsia-50 border-purple-200",
    iconColor: "text-purple-600",
  },
  {
    domain: "jia1669.com",
    url: "https://jia1669.com",
    title: "Jia1669",
    tagline: "เว็บไซต์ส่วนตัวของหมอเจี่ย",
    icon: Globe,
    gradient: "from-slate-50 to-gray-50 border-slate-200",
    iconColor: "text-slate-600",
  },
];

const ROTATE_MS = 5000;

export default function AdRotator() {
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
    <div className="w-full">
      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground mb-3">
        เว็บไซต์ในเครือ
      </p>
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className={`group block rounded-xl border bg-gradient-to-r ${ad.gradient} p-5 sm:p-6 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500`}
        aria-label={`${ad.title} — ${ad.domain}`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${ad.iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{ad.title}</h3>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{ad.tagline}</p>
            <p className="text-xs font-mono text-muted-foreground/80 mt-1">{ad.domain}</p>
          </div>
        </div>
      </a>

      <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="เลือกโฆษณา">
        {ADS.map((a, i) => (
          <button
            key={a.domain}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={a.domain}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-teal-600" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
