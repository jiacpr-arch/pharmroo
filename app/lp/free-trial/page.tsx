import type { Metadata } from "next";
import LeadForm from "./LeadForm";

export const metadata: Metadata = {
  title: "ทดลองใช้ PharmRoo ฟรี — เตรียมสอบ PLE และ NLE ด้วย AI",
  description:
    "รับโค้ดทดลองใช้ PharmRoo ฟรี 1 เดือน ข้อสอบ PLE-PC, PLE-CC1 และ NLE พร้อม AI อธิบายทุกข้อ",
};

interface SearchParams {
  campaign?: string;
  ad_set?: string;
  reward?: string;
}

export default async function FreeTrialPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 py-16 px-4">
      <div className="mx-auto max-w-lg">
        {/* Hero */}
        <div className="mb-8 text-center space-y-3">
          <p className="text-3xl font-bold text-gray-900">
            💊 PharmRoo
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            ทดลองใช้ฟรี 1 เดือน
          </h1>
          <p className="text-gray-600">
            เตรียมสอบ PLE และ NLE ด้วย AI — ข้อสอบครอบคลุม เฉลยละเอียด ฝึกได้ทุกที่
          </p>
        </div>

        {/* Social proof */}
        <div className="mb-6 grid grid-cols-3 gap-3 text-center">
          {[
            { value: "1,300+", label: "ข้อสอบ" },
            { value: "AI", label: "อธิบายทุกข้อ" },
            { value: "฿249", label: "รายเดือน" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/70 py-3 shadow-sm">
              <p className="text-xl font-bold text-violet-700">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        <LeadForm
          campaign={params.campaign}
          adSet={params.ad_set}
          reward={params.reward}
        />

        <p className="mt-4 text-center text-xs text-gray-400">
          ไม่ต้องใส่บัตรเครดิต • ยกเลิกได้ทุกเวลา
        </p>
      </div>
    </main>
  );
}
