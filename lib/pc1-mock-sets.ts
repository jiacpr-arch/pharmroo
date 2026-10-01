import type { McqQuestion } from "@/lib/types-mcq";
import { PC1_MOCK1 } from "@/lib/pc1-mock1";
import { PC1_MOCK2 } from "@/lib/pc1-mock2";

// รายการชุดจำลองสอบ PC1 (ชุดละ 120 ข้อ 12 หมวด) — เพิ่มเซตใหม่ที่นี่ แล้วหน้าเลือกเซตและหน้าสอบจะใช้ร่วมกัน
export const PC1_MOCK_SETS: Record<string, McqQuestion[]> = {
  "1": PC1_MOCK1,
  "2": PC1_MOCK2,
};

// จำนวนเซตที่วางแผนไว้ทั้งหมด (เซตที่ยังไม่มีจะแสดงเป็น "เร็วๆ นี้")
export const PC1_MOCK_PLANNED_SETS = 5;
