import type { McqQuestion } from "@/lib/types-mcq";
import { PC1_PILOT_032 } from "@/lib/pc1-pilot-032";
import { PC1_SCENARIO_001 } from "@/lib/pc1-scenario-001";
import { PC1_DAY02 } from "@/lib/pc1-day02";
import { PC1_DAY03 } from "@/lib/pc1-day03";
import { PC1_DAY04 } from "@/lib/pc1-day04";

// ชุด PC1 ทั้งหมดเรียงต่อกัน (เพิ่มชุดรายวันใหม่ต่อท้าย array นี้)
const parts: McqQuestion[] = [...PC1_PILOT_032, ...PC1_SCENARIO_001, ...PC1_DAY02, ...PC1_DAY03, ...PC1_DAY04];

export const PC1_ALL: McqQuestion[] = parts.map((q) =>
  q.mcq_subjects ? { ...q, mcq_subjects: { ...q.mcq_subjects, question_count: parts.length } } : q
);

export const PC1_CASE_COUNT = new Set(PC1_ALL.map((q) => q.scenario.match(/^Case (\d+)/)?.[1])).size;
