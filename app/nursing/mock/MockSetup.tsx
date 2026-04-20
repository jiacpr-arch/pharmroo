"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { count: 20, label: "20 ข้อ", time: "20 นาที", description: "ทดลองสั้น" },
  { count: 50, label: "50 ข้อ", time: "50 นาที", description: "ซ้อมกลาง" },
  { count: 100, label: "100 ข้อ", time: "1 ชม. 40 นาที", description: "เต็มรูปแบบ" },
  { count: 150, label: "150 ข้อ", time: "2 ชม. 30 นาที", description: "จำลองสอบเต็ม" },
];

export default function MockSetup() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-rose-600" />
          <h2 className="text-base font-semibold">เลือกจำนวนข้อ (คละทุกสาขา)</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {OPTIONS.map((opt) => (
            <Card
              key={opt.count}
              className="group hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
              onClick={() => router.push(`/nursing/mock?count=${opt.count}`)}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-rose-600 mb-1">
                  {opt.count}
                </p>
                <p className="text-xs font-medium mb-2">ข้อ</p>
                <Badge
                  variant="secondary"
                  className="bg-rose-50 text-rose-600 gap-1 text-xs mb-2"
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
        </ul>
      </div>
    </div>
  );
}
