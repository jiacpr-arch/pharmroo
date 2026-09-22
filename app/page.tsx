import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PricingCard from "@/components/PricingCard";
import GoodyEmbed from "@/components/GoodyEmbed";
import { CATEGORIES, PRICING_PLANS } from "@/lib/types";
import { getNewQuestionsStats } from "@/lib/db/queries-mcq";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

export const revalidate = 60;

const coreSubjects = [
  { name: "Pharmacology", count: "1,250 ข้อ", icon: "💊", href: "/ple/practice?subject=pharmacology" },
  { name: "Pharmacotherapy", count: "980 ข้อ", icon: "🩺", href: "/ple/practice?subject=pharmacotherapy" },
  { name: "Pharmaceutics", count: "620 ข้อ", icon: "🧪", href: "/ple/practice?subject=pharmaceutics" },
  { name: "Calculation", count: "380 ข้อ", icon: "🧮", href: "/ple/practice?subject=calculation" },
  { name: "Drug Law", count: "310 ข้อ", icon: "⚖️", href: "/ple/practice?subject=law" },
  { name: "Pharmacokinetics", count: "420 ข้อ", icon: "📈", href: "/ple/practice?subject=pharmacokinetics" },
];

const featureItems = [
  { icon: BookOpen, title: "ข้อสอบคุณภาพ", desc: "โจทย์ครอบคลุม PLE-PC และ PLE-CC1" },
  { icon: Brain, title: "เฉลยละเอียด", desc: "อธิบายเหตุผลและแนวคิดสำคัญทีละขั้น" },
  { icon: ImageIcon, title: "ภาพประกอบชัดเจน", desc: "โครงสร้างยา กราฟ และ diagram ในโจทย์" },
  { icon: BarChart3, title: "วิเคราะห์จุดอ่อน", desc: "ดู accuracy และหัวข้อที่ควรทบทวนเพิ่ม" },
  { icon: Target, title: "ฝึกตรงจุด", desc: "Practice Mode และ Mock Exam พร้อมใช้งาน" },
  { icon: ShieldCheck, title: "ใช้ได้ทุกอุปกรณ์", desc: "รองรับคอมพิวเตอร์ แท็บเล็ต และมือถือ" },
];

export default async function HomePage() {
  const stats = await getNewQuestionsStats().catch(() => ({
    totalActive: 5712,
    newThisWeek: 0,
    newBySubject: [] as { icon: string; name_th: string; count: number }[],
    nextReleaseAt: null as string | null,
  }));

  const totalQuestions = stats.totalActive || 5712;

  return (
    <>
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.10),transparent_34%),radial-gradient(circle_at_85%_25%,rgba(13,148,136,0.10),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5 w-fit border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Pharmacy Exam Platform
            </Badge>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              เตรียมสอบใบประกอบ
              <br />
              <span className="text-emerald-700">วิชาชีพเภสัชกรรม</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              PLE-PC • PLE-CC1 • NLE พร้อมคลังข้อสอบกว่า{" "}
              <span className="font-semibold text-emerald-700">{totalQuestions.toLocaleString()} ข้อ</span>{" "}
              เฉลยละเอียด โครงสร้างเคมี ภาพประกอบ และโจทย์คำนวณแบบ step-by-step
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/ple/practice">
                <Button size="lg" className="w-full bg-emerald-700 px-7 text-base text-white hover:bg-emerald-800 sm:w-auto">
                  เริ่มทำข้อสอบ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ple/mock">
                <Button size="lg" variant="outline" className="w-full border-slate-300 bg-white px-7 text-base sm:w-auto">
                  <Clock3 className="mr-2 h-4 w-4" />
                  จำลองสอบจริง
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["ข้อสอบอัปเดต", "ล่าสุด"],
                ["เฉลยละเอียด", "ทุกข้อ"],
                ["ภาพประกอบ", "ชัดเจน"],
                ["วิเคราะห์ผล", "รายหัวข้อ"],
              ].map(([title, value]) => (
                <div key={title} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="text-xs text-slate-500">{title}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-500">PLE Readiness</div>
                  <div className="mt-2 text-4xl font-bold text-slate-900">72%</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-[7px] border-emerald-100 text-lg font-bold text-emerald-700">
                  72
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Pharmacology", 82],
                  ["Pharmacotherapy", 71],
                  ["Pharmaceutics", 64],
                  ["Drug Law", 90],
                ].map(([name, value]) => (
                  <div key={name as string}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{name}</span>
                      <span className="text-slate-500">{value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <Trophy className="h-4 w-4" />
                  วันนี้แนะนำให้ฝึกต่อ
                </div>
                <p className="mt-1 text-sm leading-6 text-emerald-900/70">
                  Pharmacotherapy 10 ข้อ เพื่อเพิ่มความพร้อมก่อนสอบ
                </p>
                <Link href="/ple/practice">
                  <Button className="mt-3 w-full bg-emerald-700 text-white hover:bg-emerald-800">
                    ทำต่อ 10 ข้อ
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">วันนี้อยากฝึกอะไร?</h2>
              <p className="mt-2 text-slate-500">เลือกหมวดข้อสอบแล้วเริ่มทำได้ทันที</p>
            </div>
            <Link href="/ple/practice" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
              ดูหมวดทั้งหมด →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {coreSubjects.map((subject) => (
              <Link
                key={subject.name}
                href={subject.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="text-3xl">{subject.icon}</div>
                <div className="mt-4 font-semibold text-slate-900">{subject.name}</div>
                <div className="mt-1 text-sm text-slate-500">{subject.count}</div>
                <div className="mt-5 flex items-center text-sm font-medium text-emerald-700">
                  เริ่มทำ
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <Link
                key={cat.slug}
                href={`/ple/practice?subject=${cat.slug}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-slate-50/70 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:px-8">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-emerald-700">ภาพรวมการฝึก</div>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">พร้อมฝึกต่อไหม?</h3>
            <div className="mt-6 flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-[9px] border-emerald-100 text-2xl font-bold text-emerald-700">
                72%
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-500">ทำแล้ว</p>
                <p className="text-lg font-semibold text-slate-900">1,284 / {totalQuestions.toLocaleString()} ข้อ</p>
                <p className="text-slate-500">Accuracy 76%</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button className="mt-6 w-full bg-emerald-700 text-white hover:bg-emerald-800">
                ดูผลการเรียน
              </Button>
            </Link>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-emerald-700">ตัวอย่างข้อสอบ</div>
                <h3 className="mt-1 text-xl font-bold text-slate-900">ลองทำฟรี 1 ข้อ</h3>
              </div>
              <Badge variant="outline">Pharmacotherapy</Badge>
            </div>

            <p className="text-base font-medium leading-7 text-slate-800">
              ผู้ป่วยได้รับ ACE inhibitor ยากลุ่มใดควรหลีกเลี่ยงเนื่องจากเพิ่มความเสี่ยง Hyperkalemia?
            </p>

            <div className="mt-5 space-y-3">
              {[
                "A. Thiazide diuretics",
                "B. Potassium-sparing diuretics",
                "C. Loop diuretics",
                "D. Calcium channel blockers",
              ].map((answer, index) => (
                <div
                  key={answer}
                  className={`rounded-xl border px-4 py-3 text-sm ${index === 1 ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-slate-200 text-slate-700"}`}
                >
                  {index === 1 ? "✓ " : "○ "}
                  {answer}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                เฉลย B. Potassium-sparing diuretics
              </div>
              <p className="mt-2 text-sm leading-6 text-emerald-900/75">
                ACE inhibitor ลด aldosterone ทำให้ขับ K⁺ ลดลง เมื่อใช้ร่วมกับ potassium-sparing diuretic
                จึงเพิ่มความเสี่ยง hyperkalemia
              </p>
            </div>

            <Link href="/ple/practice">
              <Button className="mt-5 w-full bg-emerald-700 text-white hover:bg-emerald-800">
                ไปทำข้อสอบจริง
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="rounded-3xl border bg-gradient-to-br from-emerald-900 to-teal-800 p-6 text-white shadow-sm">
            <div className="text-sm font-medium text-emerald-100">Mock Exam</div>
            <h3 className="mt-2 text-2xl font-bold">จำลองสนามสอบจริง</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              เลือก 50 หรือ 100 ข้อ จับเวลาเหมือนสอบจริง และดูผลแยกตามหมวดทันที
            </p>
            <div className="mt-6 space-y-3 text-sm">
              {[
                "จับเวลาเหมือนสนามจริง",
                "เลือกจำนวนข้อได้",
                "สรุปคะแนนหลังส่งข้อสอบ",
                "ดูจุดอ่อนเพื่อฝึกซ้ำ",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
            <Link href="/ple/mock">
              <Button className="mt-7 w-full bg-white text-emerald-900 hover:bg-emerald-50">
                เริ่มจำลองสอบ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">ทำไมต้อง PharmRU?</h2>
            <p className="mt-2 text-slate-500">ออกแบบให้การฝึกข้อสอบง่ายขึ้น และเห็นจุดที่ควรทบทวนได้เร็วขึ้น</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <item.icon className="h-5 w-5 text-emerald-700" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#0d1a24] px-6 py-10 text-white sm:px-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 120% 60% at 10% -10%, rgba(242,193,78,.28), transparent 55%), radial-gradient(ellipse 120% 60% at 90% 120%, rgba(13,148,136,.4), transparent 55%)",
              }}
            />
            <div className="relative grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <Badge className="mb-3 border-amber-400/40 bg-amber-400/15 text-amber-300 hover:bg-amber-400/15">
                  ใหม่ · เกมจำลองร้านยา
                </Badge>
                <h2 className="text-3xl font-black sm:text-4xl">
                  เกม<span className="text-amber-400">ร้านยา</span> — ซักประวัติ จ่ายยา ตัดสินใจจริง
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                  รับลูกค้าที่เดินเข้าร้าน ซักประวัติแบบ WWHAM คัดกรอง red flag
                  เลือกยาให้ถูกคนภายใต้เวลากดดัน ตัดสินใจผิด ผู้ป่วยแย่ลงจริง
                  เล่นฟรีทุกเคส ไม่ต้องล็อกอิน
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <Link href="/game">
                  <Button size="lg" className="w-full gap-2 bg-amber-400 text-slate-900 hover:bg-amber-300 lg:w-auto">
                    เริ่มรับลูกค้า <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-slate-400">3 เคสตัวอย่าง · เก็บ XP และ badge เมื่อล็อกอิน</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold">ข่าวสารสุขภาพ</h2>
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <GoodyEmbed site="health" type="news" title="ข่าวสารสุขภาพ" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">แพ็กเกจราคา</h2>
            <p className="mt-2 text-slate-500">เลือกแพ็กเกจที่เหมาะกับคุณ</p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-6 sm:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Badge className="mb-4 border-white/20 bg-white/10 text-white">พร้อมเริ่มแล้วหรือยัง?</Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">ฝึกวันนี้ ให้พร้อมกว่าวันสอบจริง</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            เริ่มจาก 10 ข้อ แล้วให้ PharmRU ช่วยบอกว่าควรทบทวนอะไรต่อ
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/ple/practice">
              <Button size="lg" className="w-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400 sm:w-auto">
                เริ่มทำข้อสอบ
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
