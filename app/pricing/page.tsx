import type { Metadata } from "next";
import { getQuestionSets } from "@/lib/db/queries-mcq";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "แพ็กเกจราคา",
  description: "เลือกแพ็กเกจเตรียมสอบ PLE (เภสัช) หรือ NLE (พยาบาล) ที่เหมาะกับคุณ",
};

export const dynamic = "force-dynamic";

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
  return <PricingClient nursingSets={nursingSets} />;
}
