import type { Metadata } from "next";
import { getQuestionSets } from "@/lib/db/queries-mcq";
import JsonLd from "@/components/JsonLd";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "แพ็กเกจราคา",
  description: "เลือกแพ็กเกจเตรียมสอบ PLE (เภสัช) หรือ NLE (พยาบาล) ที่เหมาะกับคุณ",
};

export const dynamic = "force-dynamic";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "สมาชิกฟรีทำอะไรได้บ้าง?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ทำข้อสอบได้ 10 ข้อต่อวัน ดูโจทย์ได้ทุกข้อ แต่ไม่เห็นเฉลยละเอียด",
      },
    },
    {
      "@type": "Question",
      name: "สมาชิกรายเดือน/รายปี ใช้ได้ทั้ง PLE และ NLE ไหม?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ได้ครับ หนึ่ง subscription ใช้ได้ทุก track ไม่ต้องสมัครแยก เหมาะสำหรับคนที่สนใจหลายสาย",
      },
    },
    {
      "@type": "Question",
      name: "ชุดข้อสอบกับ Subscription ต่างกันอย่างไร?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ชุดข้อสอบซื้อครั้งเดียวได้ชุดนั้นตลอด เหมาะถ้าต้องการเฉพาะบางวิชา Subscription รายเดือน/ปีเข้าถึงทุกชุดและข้อสอบใหม่ที่อัปเดตตลอด",
      },
    },
    {
      "@type": "Question",
      name: "สมัครแล้วยกเลิกได้ไหม?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ได้เลย ยกเลิกได้ทุกเมื่อ สมาชิกจะยังใช้งานได้จนกว่าจะหมดรอบบิล",
      },
    },
  ],
};

export default async function PricingPage() {
  const sets = await getQuestionSets();
  const nursingSets = sets
    .filter((s) => s.exam_type === "NLE")
    .map((s) => ({
      id: s.id,
      name: s.name_th,
      price: s.price,
      highlight: s.is_bundle,
    }));
  return (
    <>
      <JsonLd data={faqLd} />
      <PricingClient nursingSets={nursingSets} />
    </>
  );
}
