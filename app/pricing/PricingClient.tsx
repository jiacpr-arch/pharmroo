"use client";

import { useState } from "react";
import PricingCard from "@/components/PricingCard";
import { PRICING_PLANS } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle, Sparkles } from "lucide-react";

const PHARMACY_SETS = [
  { name: "PLE-CC1 Day 1 (120 ข้อ)", price: 390, id: "ple-cc1-day1" },
  { name: "PLE-CC1 Day 2 (120 ข้อ)", price: 390, id: "ple-cc1-day2" },
  { name: "PLE-CC1 ครบ 2 วัน (240 ข้อ)", price: 590, highlight: true, id: "ple-cc1-bundle" },
  { name: "PLE-PC1 (120 ข้อ)", price: 490, id: "ple-pc1" },
  { name: "Bundle ทุกชุด", price: 990, highlight: true, id: "bundle-all" },
];

type Track = "pharmacy" | "nursing";

type NursingSet = {
  id: string;
  name: string;
  price: number;
  highlight?: boolean;
};

export default function PricingClient({ nursingSets = [] }: { nursingSets?: NursingSet[] }) {
  const [track, setTrack] = useState<Track>("pharmacy");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold">แพ็กเกจราคา</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          เลือกแพ็กเกจเตรียมสอบ PLE (เภสัช) หรือ NLE (พยาบาล) ที่เหมาะกับคุณ
        </p>
      </div>

      {/* Track toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-full border bg-muted p-1">
          <button
            onClick={() => setTrack("pharmacy")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              track === "pharmacy"
                ? "bg-white shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💊 เภสัช (PLE)
          </button>
          <button
            onClick={() => setTrack("nursing")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              track === "nursing"
                ? "bg-white shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💉 พยาบาล (NLE)
          </button>
        </div>
      </div>

      {/* Subscription plans (universal — covers both tracks) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start max-w-4xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
        ✨ สมาชิกรายเดือน/รายปี เข้าถึงข้อสอบ <strong>ทั้ง PLE และ NLE</strong> โดยไม่ต้องสมัครแยก
      </p>

      {/* Question Sets section — varies by track */}
      <div className="mt-16 max-w-4xl mx-auto">
        {track === "pharmacy" ? (
          <div className="rounded-xl border bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 p-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-6 w-6 text-teal-700" />
              <h2 className="text-2xl font-bold text-teal-900">ชุดข้อสอบเภสัช — ซื้อครั้งเดียว</h2>
            </div>
            <p className="text-teal-700 mb-6">
              ไม่ต้องสมัคร Subscription — จ่ายครั้งเดียว เข้าถึงชุดข้อสอบนั้นได้ตลอดไม่มีวันหมดอายุ
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {PHARMACY_SETS.map((s) => (
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
        ) : (
          <div className="rounded-xl border bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 p-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-rose-700" />
              <h2 className="text-2xl font-bold text-rose-900">
                ชุดข้อสอบพยาบาล {nursingSets.length === 0 && "— เร็วๆ นี้"}
              </h2>
            </div>
            <p className="text-rose-700 mb-6">
              {nursingSets.length > 0
                ? "ชุดข้อสอบ NLE แบบซื้อครั้งเดียว — จ่ายครั้งเดียว เข้าถึงได้ตลอดไม่มีวันหมดอายุ"
                : "ชุดข้อสอบ NLE แบบซื้อครั้งเดียวกำลังจัดเตรียม — ระหว่างนี้สมัคร Subscription รายเดือน/รายปี เพื่อเข้าถึงข้อสอบ NLE ทั้งหมดได้ทันที"}
            </p>

            {nursingSets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {nursingSets.map((s) => (
                  <Link key={s.id} href={`/sets/${s.id}`}>
                    <div
                      className={`rounded-lg border p-4 flex items-center justify-between cursor-pointer transition-opacity hover:opacity-80 ${
                        s.highlight
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-white border-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 shrink-0 ${s.highlight ? "text-rose-200" : "text-rose-500"}`} />
                        <span className="text-sm font-medium">{s.name}</span>
                      </div>
                      <span className={`font-bold text-sm ml-2 shrink-0 ${s.highlight ? "text-white" : "text-rose-700"}`}>
                        ฿{s.price.toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-rose-300 bg-white/60 p-6 text-center mb-6">
                <p className="text-sm text-rose-700">
                  🚧 ทีมงานกำลังจัดชุดข้อสอบ NLE แบบซื้อครั้งเดียว<br />
                  คาดว่าเปิดให้ซื้อเร็วๆ นี้
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <p className="text-sm text-rose-700">
                สมาชิกรายเดือน/รายปี ใช้ได้ทั้งเภสัชและพยาบาล
              </p>
              <Link href={nursingSets.length > 0 ? "/sets" : "/nursing"}>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white shrink-0">
                  {nursingSets.length > 0 ? "ดูชุดข้อสอบทั้งหมด" : "ดูเนื้อหา NLE"}
                </Button>
              </Link>
            </div>
          </div>
        )}
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
              q: "สมาชิกรายเดือน/รายปี ใช้ได้ทั้ง PLE และ NLE ไหม?",
              a: "ได้ครับ หนึ่ง subscription ใช้ได้ทุก track ไม่ต้องสมัครแยก เหมาะสำหรับคนที่สนใจหลายสาย",
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
              q: "ข้อสอบมีรูปประกอบไหม?",
              a: "มีครับ — ข้อสอบเภสัชมีโครงสร้างเคมี/กราฟ ข้อสอบพยาบาลมี ECG/ภาพผู้ป่วย/รูป procedure เมื่อจำเป็น",
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
