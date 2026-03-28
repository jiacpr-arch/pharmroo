import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PricingCard from "@/components/PricingCard";
import { CATEGORIES, PRICING_PLANS } from "@/lib/types";
import {
  BookOpen,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  FlaskConical,
  Calculator,
  Image,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Sparkles className="h-3 w-3 mr-1" /> แพลตฟอร์มข้อสอบ PLE เภสัชกรรม
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              เตรียมสอบใบประกอบ
              <br />
              <span className="text-brand-light">วิชาชีพเภสัชกรรม</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
              ข้อสอบ PLE-PC + PLE-CC1 ครบทุกหมวดวิชา
              พร้อมเฉลยละเอียด โครงสร้างเคมี และ Step-by-step คำนวณ
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/ple/practice">
                <Button
                  size="lg"
                  className="bg-brand hover:bg-brand-light text-white px-8 text-base"
                >
                  ฝึกทำข้อสอบ <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/ple/mock">
                <Button
                  size="lg"
                  className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-8 text-base"
                >
                  จำลองสอบจริง <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> สำหรับเภสัชกร
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> PLE-PC & PLE-CC1
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> เฉลยจากผู้เชี่ยวชาญ
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">หมวดวิชาที่ครอบคลุม</h2>
            <p className="mt-2 text-muted-foreground">ครบทุกหมวดที่ออกสอบ PLE-PC และ PLE-CC1</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/ple/practice?subject=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border p-6 transition-all hover:shadow-md hover:border-brand/30"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span className="text-sm font-medium text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">ทำไมต้อง PharmRoo?</h2>
            <p className="mt-2 text-muted-foreground">ออกแบบมาสำหรับข้อสอบเภสัชโดยเฉพาะ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Image,
                title: "โครงสร้างเคมีในโจทย์",
                desc: "แสดงรูปสูตรโครงสร้างยา กราฟ และ diagram ในโจทย์ได้ เหมือนสอบจริง",
              },
              {
                icon: Calculator,
                title: "เฉลยคำนวณ Step-by-step",
                desc: "แสดงขั้นตอนคำนวณ IV rate, osmolality, assay, dilution อย่างละเอียด",
              },
              {
                icon: FlaskConical,
                title: "ครบทุกหมวด PLE",
                desc: "Pharmacotherapy, เทคโนโลยีเภสัช, เภสัชเคมี, วิเคราะห์, จลนศาสตร์, กฎหมาย, สมุนไพร",
              },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-4 p-6 rounded-xl bg-white border">
                <div className="mx-auto w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-brand" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">วิธีใช้งาน</h2>
            <p className="mt-2 text-muted-foreground">2 โหมดให้เลือก</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl border bg-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Practice Mode</h3>
              </div>
              <p className="text-muted-foreground">
                เลือกหมวดวิชาที่ต้องการ ทำทีละข้อ ไม่จับเวลา
                เหมาะสำหรับทบทวนและเรียนรู้
              </p>
              <Link href="/ple/practice">
                <Button className="bg-brand hover:bg-brand-light text-white mt-2">
                  เริ่มฝึก <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="p-8 rounded-2xl border bg-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold">Mock Exam</h3>
              </div>
              <p className="text-muted-foreground">
                จำลองสอบจริง PLE-CC1 รวมทุกหมวด จับเวลา
                ดูผลคะแนนหลังทำเสร็จ
              </p>
              <Link href="/ple/mock">
                <Button className="bg-brand hover:bg-brand-light text-white mt-2">
                  จำลองสอบ <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-muted/30" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">แพ็กเกจราคา</h2>
            <p className="mt-2 text-muted-foreground">เลือกแพ็กเกจที่เหมาะกับคุณ</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start max-w-4xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            พร้อมเตรียมสอบใบประกอบเภสัชกรรม?
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            สมัครสมาชิกวันนี้ เข้าถึงข้อสอบ PLE ครบทุกหมวด พร้อมเฉลยละเอียด
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-brand hover:bg-brand-light text-white px-8 text-base"
              >
                สมัครสมาชิกฟรี
              </Button>
            </Link>
            <Link href="/ple/practice">
              <Button
                size="lg"
                className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 text-base"
              >
                ลองทำข้อสอบ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
