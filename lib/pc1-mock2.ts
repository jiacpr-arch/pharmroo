import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Mock, PC1_MOCK_DOMAINS, type Pc1MockItem } from "@/lib/pc1-mock-builder";
import { MOCK2_DAY01 } from "@/lib/pc1-mock2-day01";
import { MOCK2_DAY02 } from "@/lib/pc1-mock2-day02";

// PC1 Mock Set 2 (120 ข้อ = 12 หมวด × 10 ข้อ)
// ใช้เคสจากคลัง PC1 เดิมที่ยังไม่อยู่ในเซต 1 ก่อน แล้วเติมหมวดที่ขาดด้วยข้อใหม่
const ITEMS: Record<string, Pc1MockItem[]> = {
  cardio: [{ reuse: 2 }, { reuse: 18 }],
  infection: [{ reuse: 3 }, { reuse: 11 }],
  renal: [{ reuse: 31 }, ...MOCK2_DAY01.renal],
  endocrine: [{ reuse: 1 }, { reuse: 30 }, ...MOCK2_DAY01.endocrine],
  neuro: [...MOCK2_DAY01.neuro],
  psych: [...MOCK2_DAY02.psych],
  resp: [...MOCK2_DAY02.resp],
};

export const PC1_MOCK2: McqQuestion[] = buildPc1Mock(
  PC1_MOCK_DOMAINS.map((d) => ({ ...d, items: ITEMS[d.key] ?? [] })),
  { setNo: 2, createdAt: "2026-10-04 09:00:00" }
);
