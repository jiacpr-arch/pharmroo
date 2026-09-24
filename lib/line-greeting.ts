/**
 * Greetings for the LINE OA bot — used for a new follower, or when a
 * message can't be answered as text (sticker / image / voice note / etc).
 */

/** Human-readable placeholder for a non-text event. */
export function describeNonTextMessage(type: string | undefined): string {
  switch (type) {
    case "sticker":
      return "[สติกเกอร์]";
    case "image":
      return "[รูปภาพ]";
    case "video":
      return "[วิดีโอ]";
    case "audio":
      return "[ข้อความเสียง]";
    case "file":
      return "[ไฟล์]";
    case "location":
      return "[ตำแหน่งที่ตั้ง]";
    default:
      return "[ข้อความที่ไม่ใช่ตัวอักษร]";
  }
}

/** True for LINE message types this bot cannot read (everything but text). */
export function isNonTextMessage(type: string | undefined): boolean {
  return !!type && type !== "text";
}

/** Reply to a sticker / image / other non-text message. */
export function buildNonTextGreeting(): string {
  return [
    "ได้รับแล้วครับ 😊 บอทตอบได้เฉพาะข้อความตัวอักษรนะครับ",
    "",
    "ส่งรหัสเชื่อมต่อจากหน้า Profile เพื่อรับแจ้งเตือนผ่าน LINE ได้เลยครับ",
  ].join("\n");
}
