import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "แพ็กเกจราคา",
  description: "เลือกแพ็กเกจเตรียมสอบ PLE (เภสัช) หรือ NLE (พยาบาล) ที่เหมาะกับคุณ",
};

export default function PricingPage() {
  return <PricingClient />;
}
