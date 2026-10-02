import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Mock, PC1_MOCK_DOMAINS, type Pc1MockItem } from "@/lib/pc1-mock-builder";
import { MOCK3_DAY01 } from "@/lib/pc1-mock3-day01";
import { MOCK3_REUSE } from "@/lib/pc1-mock3-reuse";

// PC1 Mock Set 3 (120 ข้อ = 12 หมวด × 10 ข้อ)
// หัวใจ: Case 4, 9 และโรคติดเชื้อ: Case 10, 22 จากคลังเดิม (คำอธิบายเขียนใหม่) แล้วเติมหมวดอื่นด้วยข้อใหม่
const ITEMS: Record<string, Pc1MockItem[]> = {
  cardio: [...MOCK3_REUSE.cardio],
  infection: [...MOCK3_REUSE.infection],
  renal: [...MOCK3_DAY01.renal],
  endocrine: [...MOCK3_DAY01.endocrine],
};

export const PC1_MOCK3: McqQuestion[] = buildPc1Mock(
  PC1_MOCK_DOMAINS.map((d) => ({ ...d, items: ITEMS[d.key] ?? [] })),
  { setNo: 3, createdAt: "2026-10-08 09:00:00" }
);
