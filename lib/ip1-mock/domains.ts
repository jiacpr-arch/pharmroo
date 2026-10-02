import type { Ip1MockDomainContent } from "@/lib/ip1-mock/types";
import { PREFORM } from "@/lib/ip1-mock/preform";
import { SOLID } from "@/lib/ip1-mock/solid";
import { LIQUID } from "@/lib/ip1-mock/liquid";
import { STERILE } from "@/lib/ip1-mock/sterile";
import { NDDS } from "@/lib/ip1-mock/ndds";
import { BIOPHARM } from "@/lib/ip1-mock/biopharm";
import { STABILITY } from "@/lib/ip1-mock/stability";
import { ANALYSIS } from "@/lib/ip1-mock/analysis";
import { GMP } from "@/lib/ip1-mock/gmp";
import { QA } from "@/lib/ip1-mock/qa";
import { CALC } from "@/lib/ip1-mock/calc";
import { REGULATORY } from "@/lib/ip1-mock/regulatory";

export type Ip1MockDomain = { key: string; name_th: string; icon: string; sets: Ip1MockDomainContent };

// 12 หมวดของ IP1 Mock ตามลำดับในชุดข้อสอบ (หมวดละ 10 ข้อ/เซต)
export const IP1_MOCK_DOMAINS: Ip1MockDomain[] = [
  { key: "preform", name_th: "Preformulation และเภสัชกรรมเชิงฟิสิกส์", icon: "🔬", sets: PREFORM },
  { key: "solid", name_th: "ยาเตรียมรูปแบบของแข็ง", icon: "💊", sets: SOLID },
  { key: "liquid", name_th: "ยาน้ำ ระบบกระจายตัว และยากึ่งแข็ง", icon: "🧴", sets: LIQUID },
  { key: "sterile", name_th: "ผลิตภัณฑ์ปราศจากเชื้อ", icon: "💉", sets: STERILE },
  { key: "ndds", name_th: "ระบบนำส่งยาแบบควบคุมและรูปแบบใหม่", icon: "🧪", sets: NDDS },
  { key: "biopharm", name_th: "ชีวเภสัชกรรมและชีวสมมูล", icon: "📈", sets: BIOPHARM },
  { key: "stability", name_th: "ความคงตัวและบรรจุภัณฑ์", icon: "📦", sets: STABILITY },
  { key: "analysis", name_th: "การวิเคราะห์และควบคุมคุณภาพ", icon: "⚗️", sets: ANALYSIS },
  { key: "gmp", name_th: "GMP สถานที่ และระบบสนับสนุนการผลิต", icon: "🏭", sets: GMP },
  { key: "qa", name_th: "ระบบคุณภาพและการตรวจสอบความถูกต้อง", icon: "✅", sets: QA },
  { key: "calc", name_th: "การคำนวณและสถิติในการผลิต", icon: "🧮", sets: CALC },
  { key: "regulatory", name_th: "การขึ้นทะเบียนและการพัฒนาผลิตภัณฑ์", icon: "📋", sets: REGULATORY },
];

export const IP1_MOCK_PER_DOMAIN = 10;
