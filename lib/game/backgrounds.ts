// Background registry — เกมร้านยา
//
//   - โจทย์เลือกฉากด้วย field `bg` (id ด้านล่าง) — ไม่ระบุ = drugstore_counter
//   - รูปจริงวางที่ public/images/game/backgrounds/{id}.webp (แนวนอน 1536x1024)
//   - id ที่ประกาศไว้แต่ยังไม่มีไฟล์รูป ให้คงอยู่นอก GAME_BG_READY —
//     เกมจะ fallback เป็นฉากที่มีรูปจนกว่าจะวางไฟล์แล้วย้าย id เข้า GAME_BG_READY

export const GAME_BACKGROUNDS: Record<string, { name: string }> = {
  drugstore_counter: { name: "เคาน์เตอร์ร้านยา" },
  drugstore_shelf: { name: "ชั้นวางยาในร้าน" },
  opd_room: { name: "ห้องตรวจ / ห้องให้คำปรึกษา" },
};

/** ฉากที่มีไฟล์รูปแล้ว — เพิ่ม id ที่นี่เมื่อวางรูปใน public/images/game/backgrounds/ */
const GAME_BG_READY = new Set(["opd_room"]);

export const DEFAULT_BG = "drugstore_counter";
/** ฉากที่ใช้แทนเมื่อฉากที่ขอยังไม่มีรูป */
const FALLBACK_BG = "opd_room";

export function gameBgUrl(bg?: string): string {
  const id = bg && GAME_BG_READY.has(bg) ? bg : GAME_BG_READY.has(DEFAULT_BG) ? DEFAULT_BG : FALLBACK_BG;
  return `/images/game/backgrounds/${id}.webp`;
}
