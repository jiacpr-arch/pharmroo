import PricingCard from "@/components/PricingCard";
import { PRICING_PLANS } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "แพ็กเกจราคา",
  description: "เลือกแพ็กเกจเตรียมสอบเภสัชกรรมที่เหมาะกับคุณ",
};

const QUESTION_SETS_PREVIEW = [
  { name: "PLE-CC1 Day 1 (120 ข้อ)", price: 390, id: "ple-cc1-day1" },
  { name: "PLE-CC1 Day 2 (120 ข้อ)", price: 390, id: "ple-cc1-day2" },
  { name: "PLE-CC1 ครบ 2 วัน (240 ข้อ)", price: 590, highlight: true, id: "ple-cc1-bundle" },
  { name: "PLE-PC1 (120 ข้อ)", price: 490, id: "ple-pc1" },
  { name: "Bundle ทุกชุด", price: 990, highlight: true, id: "bundle-all" },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold">แพ็กเกจราคา</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          เลือกแพ็กเกจที่เหมาะกับการเตรียมสอบ PLE ของคุณ
        </p>
      </div>

      {/* Subscription plans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start max-w-4xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>

      {/* Question Sets section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="rounded-xl border bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 p-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6 text-teal-700" />
            <h2 className="text-2xl font-bold text-teal-900">ชุดข้อสอบ — ซื้อครั้งเดียว</h2>
          </div>
          <p className="text-teal-700 mb-6">
            ไม่ต้องสมัคร Subscription — จ่ายครั้งเดียว เข้าถึงชุดข้อสอบนั้นได้ตลอดไม่มีวันหมดอายุ
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {QUESTION_SETS_PREVIEW.map((s) => (
              <Link key={s.name} href={`/sets/${s.id}`}>
                <div
                  className={`rounded-lg border p-4 flex items-center justify-between cursor-pointer transition-opacity hover:opacity-80 ${
                    s.highlight
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white border-teal-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 shrink-0 ${s.highlight ? "text-teal-200" : "text-teal-500"}`} />
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                  <span className={`font-bold text-sm ml-2 shrink-0 ${s.highlight ? "text-white" : "text-teal-700"}`}>
                    ฿{s.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <p className="text-sm text-teal-700">
              ถูกกว่าคอร์สติว 10 เท่า — ติวออนไลน์ทั่วไปราคา ฿8,000–10,000
            </p>
            <Link href="/sets">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white shrink-0">
                ดูชุดข้อสอบทั้งหมด
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          คำถามที่พบบ่อย
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "สมาชิกฟรีทำอะไรได้บ้าง?",
              a: "ทำข้อสอบได้ 10 ข้อต่อวัน ดูโจทย์ได้ทุกข้อ แต่ไม่เห็นเฉลยละเอียด",
            },
            {
              q: "ชุดข้อสอบกับ Subscription ต่างกันอย่างไร?",
              a: "ชุดข้อสอบซื้อครั้งเดียวได้ชุดนั้นตลอด เหมาะถ้าต้องการเฉพาะบางวิชา Subscription รายเดือน/ปีเข้าถึงทุกชุดและข้อสอบใหม่ที่อัปเดตตลอด",
            },
            {
              q: "สมัครแล้วยกเลิกได้ไหม?",
              a: "ได้เลย ยกเลิกได้ทุกเมื่อ สมาชิกจะยังใช้งานได้จนกว่าจะหมดรอบบิล",
            },
            {
              q: "ข้อสอบมีรูปโครงสร้างเคมีไหม?",
              a: "มีครับ ข้อสอบที่ต้องใช้รูปโครงสร้างยาหรือกราฟจะแสดงรูปภาพประกอบให้เหมือนสอบจริง",
            },
          ].map((faq) => (
            <div key={faq.q} className="border rounded-lg p-5">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
