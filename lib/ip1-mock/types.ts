// ข้อสอบเดี่ยวของ IP1 Mock (ใช้รูปแบบย่อเพื่อให้ไฟล์เนื้อหาอ่านง่าย)
// t = หัวข้อ (ภาษาอังกฤษสั้นๆ, ห้ามซ้ำภายในหมวดทุกเซต), p = โจทย์, o = ตัวเลือก 5 ข้อ, a = index คำตอบใน o
// r = เหตุผลเชิงลึก, w = คำอธิบายรายตัวเลือก (เรียงตาม o), k = key takeaway, c = ขั้นตอนคำนวณ (ถ้ามี)
// ตัวเลือกที่ขึ้นต้นด้วยตัวเลขทุกข้อจะคงลำดับเดิม (เรียงจากน้อยไปมาก); ตัวเลือกข้อความจะถูกสลับตำแหน่งคำตอบโดย builder
export type Ip1MockQ = {
  t: string;
  p: string;
  o: [string, string, string, string, string];
  a: number;
  r: string;
  w: [string, string, string, string, string];
  k: string;
  d: "easy" | "medium" | "hard";
  ref: string;
  c?: string[];
};

// เนื้อหาของหมวดหนึ่ง: sets[0] = Mock Set 1, sets[1] = Mock Set 2, ... (เซตละ 10 ข้อ)
export type Ip1MockDomainContent = Ip1MockQ[][];
