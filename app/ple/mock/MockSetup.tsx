"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, CalendarDays, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";

const REAL_EXAM_OPTIONS = [
  {
    day: 1,
    label: "Day 1",
    description: "จำลองสอบวันที่ 1 ของ PLE-CC1",
    count: 120,
    time: "2 ชั่วโมง",
    color: "border-teal-200 hover:border-teal-400",
    badgeClass: "bg-teal-100 text-teal-700",
    topics: "Pharmacotherapy, Pharma Tech, กฎหมาย",
  },
  {
    day: 2,
    label: "Day 2",
    description: "จำลองสอบวันที่ 2 ของ PLE-CC1",
    count: 120,
    time: "2 ชั่วโมง",
    color: "border-blue-200 hover:border-blue-400",
    badgeClass: "bg-blue-100 text-blue-700",
    topics: "เภสัชเคมี, วิเคราะห์, จลนศาสตร์, สมุนไพร",
  },
];

const SHORT_OPTIONS = [
  { count: 20, label: "20 ข้อ", time: "20 นาที", description: "ทดลองสั้น" },
  { count: 50, label: "50 ข้อ", time: "50 นาที", description: "ซ้อมกลาง" },
];

export default function MockSetup() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Real exam simulation */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-brand" />
          <h2 className="text-base font-semibold">จำลองสอบ PLE-CC1 จริง</h2>
          <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
            120 ข้อ × 2 วัน
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REAL_EXAM_OPTIONS.map((opt) => (
            <Card
              key={opt.day}
              className={`group transition-all cursor-pointer ${opt.color}`}
              onClick={() => router.push(`/ple/mock?day=${opt.day}&count=120`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xl font-bold">{opt.label}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {opt.description}
                    </p>
                  </div>
                  <Badge className={`${opt.badgeClass} gap-1`}>
                    <Clock className="h-3 w-3" /> {opt.time}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  หมวด: {opt.topics}
                </p>
                <Button
                  className="w-full bg-brand hover:bg-brand-light text-white gap-2"
                  size="sm"
                >
                  เริ่มสอบ {opt.label} <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Short practice */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold">ซ้อมแบบย่อ (คละทุกหมวด)</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SHORT_OPTIONS.map((opt) => (
            <Card
              key={opt.count}
              className="group hover:shadow-md hover:border-brand/30 transition-all cursor-pointer"
              onClick={() => router.push(`/ple/mock?count=${opt.count}`)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-brand mb-1">
                  {opt.count}
                </p>
                <p className="text-xs font-medium mb-2">ข้อ</p>
                <Badge
                  variant="secondary"
                  className="bg-teal-50 text-teal-600 gap-1 text-xs mb-2"
                >
                  <Clock className="h-3 w-3" /> {opt.time}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {opt.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-1 border-t pt-4">
        <p className="font-medium">หมายเหตุ</p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>จับเวลา 1 นาทีต่อข้อ</li>
          <li>ดูเฉลยได้หลังส่งข้อสอบเท่านั้น</li>
          <li>สามารถข้ามไปทำข้อไหนก่อนก็ได้</li>
          <li>PLE-CC1 จริง: 120 ข้อ/วัน ใช้เวลา 2 ชั่วโมง</li>
        </ul>
      </div>
    </div>
  );
}
