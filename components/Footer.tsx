import Link from "next/link";

const networkSites = [
  { icon: "❤️‍🩹", name: "MorRoo CPR", desc: "เรียนรู้การช่วยฟื้นคืนชีพ (CPR)", href: "https://cpr.morroo.com" },
  { icon: "➕", name: "MorRoo BLS", desc: "หลักสูตร Basic Life Support", href: "https://bls.morroo.com" },
  { icon: "💓", name: "MorRoo ACLS", desc: "หลักสูตร ACLS สำหรับบุคลากรการแพทย์", href: "https://acls.morroo.com" },
  { icon: "🚑", name: "MorRoo EMR", desc: "หลักสูตรผู้ปฏิบัติการฉุกเฉินการแพทย์", href: "https://emr.morroo.com" },
  { icon: "🩹", name: "MorRoo First Aid", desc: "ปฐมพยาบาลเบื้องต้นที่ทุกคนควรรู้", href: "https://firstaid.morroo.com" },
  { icon: "💊", name: "MorRoo Drug", desc: "ข้อมูลยาและการใช้ยา", href: "https://drug.morroo.com" },
  { icon: "🧪", name: "MorRoo Lab", desc: "แปลผลตรวจทางห้องปฏิบัติการ", href: "https://lab.morroo.com" },
  { icon: "☂️", name: "MorRoo Pharma", desc: "ความรู้เภสัชวิทยา", href: "https://pharma.morroo.com" },
  { icon: "🔍", name: "ICD-10", desc: "ค้นหารหัสโรค ICD-10 ภาษาไทยแบบเร็ว", href: "https://icd10.morroo.com" },
  { icon: "📒", name: "Pocket MorRoo", desc: "คู่มือพกพาสำหรับแพทย์", href: "https://pocket.morroo.com" },
  { icon: "💬", name: "MorRoo Advice", desc: "ผู้ช่วย AI ให้คำแนะนำทางคลินิก", href: "https://advice.morroo.com" },
  { icon: "✍️", name: "JiaCPR", desc: "ศูนย์อบรมการช่วยฟื้นคืนชีพและสื่อการแพทย์", href: "https://jiacpr.com" },
  { icon: "⚡", name: "JiaAED", desc: "เครื่องกระตุกหัวใจไฟฟ้าอัตโนมัติ (AED)", href: "https://aed.morroo.com" },
  { icon: "🚑", name: "Jia 1669", desc: "เครื่องมือฉุกเฉินทางการแพทย์", href: "https://1669.morroo.com" },
  { icon: "📚", name: "RooDee", desc: "เครื่องมือช่วยอ่านหนังสือสอบ", href: "https://roodee.morroo.com" },
  { icon: "📖", name: "PharmRu", desc: "คู่มือยาออนไลน์", href: "https://pharmru.morroo.com" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold">
              <span className="text-2xl">💊</span>
              <span>ภ.รู้</span>
            </div>
            <p className="text-sm text-white/70">
              แพลตฟอร์มข้อสอบ PLE (เภสัช) และ NLE (พยาบาล) ออนไลน์
              <br />
              เตรียมสอบใบประกอบวิชาชีพด้วย AI ที่เข้าใจคุณ
            </p>
          </div>

          {/* PLE links */}
          <div>
            <h3 className="font-semibold mb-3">PLE เภสัช</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/ple" className="hover:text-white transition-colors">ข้อสอบ PLE ทั้งหมด</Link></li>
              <li><Link href="/ple/practice" className="hover:text-white transition-colors">ฝึกทำ PLE</Link></li>
              <li><Link href="/ple/mock" className="hover:text-white transition-colors">จำลองสอบ PLE</Link></li>
              <li><Link href="/sets" className="hover:text-white transition-colors">ชุดข้อสอบ</Link></li>
            </ul>
          </div>

          {/* NLE links */}
          <div>
            <h3 className="font-semibold mb-3">NLE พยาบาล</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/nursing" className="hover:text-white transition-colors">ข้อสอบ NLE ทั้งหมด</Link></li>
              <li><Link href="/nursing/practice" className="hover:text-white transition-colors">ฝึกทำ NLE</Link></li>
              <li><Link href="/nursing/mock" className="hover:text-white transition-colors">จำลองสอบ NLE</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">แพ็กเกจราคา</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">ติดต่อ</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/login" className="hover:text-white transition-colors">เข้าสู่ระบบ</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">สมัครสมาชิก</Link></li>
              <li>📧 jiacpr@gmail.com</li>
              <li>📱 Line: @jiacpr</li>
            </ul>
          </div>
        </div>

        {/* Network sites */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <h2 className="mb-6 text-center text-lg font-semibold">
            🌐 เว็บในเครือเรา
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {networkSites.map((site) => (
              <a
                key={site.name}
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/30 hover:bg-white/10"
              >
                <span className="text-2xl leading-none">{site.icon}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-white">{site.name}</span>
                  <span className="block text-xs text-white/60">{site.desc}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <span>© {new Date().getFullYear()} ภ.รู้ (PharmRoo) — สงวนลิขสิทธิ์</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว (PDPA)</Link>
            <Link href="/terms" className="hover:text-white transition-colors">นโยบายการซื้อสินค้า</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
