export interface Profile {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  membership_type: "free" | "monthly" | "yearly";
  membership_expires_at: string | null;
  created_at: string;
}

export const CATEGORIES = [
  { name: "Pharmacotherapy", icon: "💊", slug: "pharmacotherapy" },
  { name: "เทคโนโลยีเภสัชกรรม", icon: "🧪", slug: "pharma-tech" },
  { name: "เภสัชเคมี", icon: "⚗️", slug: "pharma-chem" },
  { name: "เภสัชวิเคราะห์", icon: "🔬", slug: "pharma-analysis" },
  { name: "เภสัชจลนศาสตร์", icon: "📈", slug: "pharmacokinetics" },
  { name: "กฎหมายยา", icon: "⚖️", slug: "pharma-law" },
  { name: "สมุนไพร", icon: "🌿", slug: "herbal" },
] as const;

export const PRICING_PLANS = [
  {
    name: "ฟรี",
    price: 0,
    period: "",
    description: "เริ่มต้นทดลองใช้งาน",
    features: [
      "ทำข้อสอบฟรี 5 ข้อ/วัน",
      "ดูโจทย์ได้ทุกข้อ",
      "ไม่เห็นเฉลยละเอียด",
    ],
    cta: "เริ่มต้นฟรี",
    popular: false,
    type: "free" as const,
  },
  {
    name: "รายเดือน",
    price: 249,
    period: "/ เดือน",
    description: "เข้าถึงข้อสอบทั้งหมด",
    features: [
      "ข้อสอบทั้งหมดไม่จำกัด",
      "เฉลยละเอียดทุกข้อ",
      "Step-by-step คำนวณ",
      "🤖 AI อธิบายเพิ่มเติม",
      "ข้อสอบใหม่ทุกสัปดาห์",
    ],
    cta: "สมัครรายเดือน",
    popular: true,
    type: "monthly" as const,
  },
  {
    name: "รายปี",
    price: 1490,
    period: "/ ปี",
    description: "ประหยัดกว่า 50%",
    features: [
      "ทุกอย่างในแพ็กรายเดือน",
      "🤖 AI อธิบายไม่จำกัด",
      "ประหยัด ฿1,498/ปี",
      "สิทธิ์ก่อนใคร",
    ],
    cta: "สมัครรายปี",
    popular: false,
    type: "yearly" as const,
  },
] as const;
