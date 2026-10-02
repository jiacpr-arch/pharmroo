import type { McqQuestion } from "@/lib/types-mcq";
import { buildIp1Mock, isIp1MockSetReady } from "@/lib/ip1-mock/builder";

// จำนวนเซตที่วางแผนไว้ทั้งหมด (เซตที่ยังไม่ครบ 12 หมวดจะแสดงเป็น "เร็วๆ นี้")
export const IP1_MOCK_PLANNED_SETS = 5;

// รายการชุดจำลองสอบ IP1 (ชุดละ 120 ข้อ 12 หมวด) — ข้อสอบแต่ละเซตมาจากคนละ array จึงไม่ซ้ำกัน
export const IP1_MOCK_SETS: Record<string, McqQuestion[]> = Object.fromEntries(
  Array.from({ length: IP1_MOCK_PLANNED_SETS }, (_, i) => i + 1)
    .filter((no) => isIp1MockSetReady(no))
    .map((no) => [String(no), buildIp1Mock(no)])
);
