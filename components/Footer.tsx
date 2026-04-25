import Link from "next/link";

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
