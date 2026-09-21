import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import GoodyEmbed from "@/components/GoodyEmbed";
import { ArrowRight, BookOpen, Brain, Clock3, Flame, Search, ShieldCheck, Sparkles, Target } from "lucide-react";

export const dynamic = "force-dynamic";

const clinicalSystems = [
  { slug: "cardiovascular", icon: "❤️", name: "หัวใจและหลอดเลือด", desc: "HF • ACS • AF • Arrhythmia", tone: "bg-rose-50 border-rose-100" },
  { slug: "hypertension", icon: "🩸", name: "ความดันโลหิตสูง", desc: "ACEI • ARB • CCB • Diuretics", tone: "bg-red-50 border-red-100" },
  { slug: "diabetes", icon: "🍬", name: "เบาหวาน", desc: "Insulin • Metformin • SGLT2i • GLP-1", tone: "bg-amber-50 border-amber-100" },
  { slug: "renal-electrolytes", icon: "🫘", name: "ไตและอิเล็กโทรไลต์", desc: "CKD • AKI • K⁺ • Na⁺ • Renal dose", tone: "bg-sky-50 border-sky-100" },
  { slug: "bone-joint", icon: "🦴", name: "กระดูกและข้อ", desc: "Osteoporosis • Gout • OA • RA", tone: "bg-violet-50 border-violet-100" },
  { slug: "dyslipidemia", icon: "🫀", name: "ไขมันในเลือด", desc: "Statin • Ezetimibe • Fibrate • PCSK9", tone: "bg-pink-50 border-pink-100" },
  { slug: "infectious-disease", icon: "🦠", name: "โรคติดเชื้อ", desc: "Antibiotics • Spectrum • Resistance", tone: "bg-emerald-50 border-emerald-100" },
  { slug: "respiratory", icon: "🫁", name: "ทางเดินหายใจ", desc: "Asthma • COPD • Inhalers", tone: "bg-cyan-50 border-cyan-100" },
  { slug: "neuro-psych", icon: "🧠", name: "ประสาทและจิตเวช", desc: "Stroke • Epilepsy • Depression", tone: "bg-indigo-50 border-indigo-100" },
  { slug: "gastrointestinal", icon: "🍽️", name: "ทางเดินอาหาร", desc: "GERD • PUD • GI bleed", tone: "bg-orange-50 border-orange-100" },
  { slug: "endocrine", icon: "🧬", name: "ต่อมไร้ท่อ", desc: "Thyroid • Adrenal • Steroid", tone: "bg-teal-50 border-teal-100" },
  { slug: "other", icon: "💊", name: "หัวข้ออื่น ๆ", desc: "PK • ADR • Interaction • Calculation", tone: "bg-slate-50 border-slate-200" },
];

const topics = ["ACE Inhibitors & ARBs","Antibiotics","Diuretics","Drug Interaction","Anticoagulants","Pharmacokinetics","Drug Law","Endocrine","CNS","Calculation"];

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);
  return <div className="min-h-screen bg-white">
    <section className="border-b bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"><BookOpen className="h-4 w-4"/> PharmRU Review</div>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">ทบทวนก่อนสอบ<br/><span className="text-emerald-700">อ่านจากเรื่องที่ออกข้อสอบบ่อย</span></h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">สรุปจากคลังข้อสอบ PharmRU ให้เข้าใจ Concept พร้อม Exam Pearl จุดหลอก และตัวอย่างข้อสอบ</p>
          <div className="mt-7 flex max-w-2xl items-center rounded-2xl border bg-white p-2 shadow-sm"><Search className="ml-3 h-5 w-5 text-slate-400"/><span className="flex-1 px-3 py-2 text-sm text-slate-400">ค้นหาเรื่อง เช่น ACEi, Diuretics, PK, กฎหมายยา...</span><Link href="/ple/practice" className="rounded-xl bg-emerald-700 p-3 text-white"><ArrowRight className="h-4 w-4"/></Link></div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/50">
          <div className="flex items-center gap-3"><div className="rounded-2xl bg-emerald-100 p-3"><Brain className="h-6 w-6 text-emerald-700"/></div><div><p className="text-sm text-slate-500">เรียนรู้จากข้อสอบจริง</p><h2 className="text-xl font-bold">Same concepts. New confidence.</h2></div></div>
          <div className="mt-5 space-y-2">{["สรุปกระชับ เข้าใจง่าย","ตรงประเด็นที่ออกสอบ","มี Exam Pearl และจุดหลอก","อ่านจบแล้วฝึกข้อสอบต่อได้"].map(x=><div key={x} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm"><ShieldCheck className="h-4 w-4 text-emerald-600"/>{x}</div>)}</div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-9 sm:px-6 lg:px-8">
  <div className="mb-3 text-sm font-semibold text-slate-700">เลือกเรื่องที่อยากทบทวน</div>
  <div className="flex flex-wrap gap-2">{["ทั้งหมด","❤️ หัวใจ","🩸 ความดัน","🍬 เบาหวาน","🫘 ไต","🦴 กระดูกและข้อ","🫀 ไขมัน","🦠 ติดเชื้อ","••• อื่น ๆ"].map((x,i)=><span key={x} className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${i===0?"border-emerald-700 bg-emerald-700 text-white":"bg-white text-slate-700"}`}>{x}</span>)}</div>
</div>
    </section>

    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="mb-14">
  <div className="mb-6"><div className="text-sm font-semibold text-emerald-700">Clinical Review Map</div><h2 className="mt-1 text-3xl font-bold text-slate-900">เลือกทบทวนตามโรคและระบบ</h2><p className="mt-2 text-slate-500">เริ่มจากโรคที่อยากอ่าน แล้วค่อยเจาะไปยังยา กลไก จุดหลอก และข้อสอบที่เกี่ยวข้อง</p></div>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{clinicalSystems.map(s=><Link key={s.name} href={`/blog/system/${s.slug}`} className={`group rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${s.tone}`}><div className="text-3xl">{s.icon}</div><h3 className="mt-3 font-bold text-slate-900">{s.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{s.desc}</p><div className="mt-4 flex items-center text-sm font-semibold text-emerald-700">ดูบททบทวน <ArrowRight className="ml-1.5 h-4 w-4"/></div></Link>)}</div>
</section>
<div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-7"><div className="flex items-center gap-2 font-semibold text-emerald-700"><Sparkles className="h-5 w-5"/>แนะนำให้อ่าน</div><h2 className="mt-1 text-3xl font-bold">บทความทบทวนก่อนสอบ</h2></div>
          {posts.length===0?<div className="rounded-3xl border border-dashed p-12 text-center text-slate-400">กำลังเตรียมบทความทบทวน</div>:
          <div className="grid gap-5 md:grid-cols-3">{posts.slice(0,3).map((p,i)=><Link key={p.id} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className={`h-44 overflow-hidden ${i===0?"bg-rose-50":i===1?"bg-blue-50":"bg-emerald-50"}`}>{p.cover_image?<img src={p.cover_image} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105"/>:<div className="flex h-full items-center justify-center text-6xl">💊</div>}</div>
            <div className="p-5"><div className="mb-3 flex items-center gap-2 text-xs text-slate-400">{p.category&&<span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{p.category}</span>}<Clock3 className="h-3.5 w-3.5"/>{p.reading_time} นาที</div><h3 className="line-clamp-2 text-lg font-bold leading-7 group-hover:text-emerald-700">{p.title}</h3>{p.description&&<p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{p.description}</p>}<div className="mt-5 flex items-center font-semibold text-emerald-700">อ่านบทความ <ArrowRight className="ml-2 h-4 w-4"/></div></div>
          </Link>)}</div>}
          {posts.length>3&&<div className="mt-12 grid gap-4 sm:grid-cols-2">{posts.slice(3).map(p=><Link key={p.id} href={`/blog/${p.slug}`} className="rounded-2xl border p-5 hover:border-emerald-200 hover:shadow-md"><div className="text-xs font-medium text-emerald-700">{p.category||"ทบทวนสอบ"}</div><h3 className="mt-2 font-bold">{p.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.description}</p></Link>)}</div>}
        </div>
        <aside className="space-y-5">
          <div className="rounded-3xl border bg-slate-50 p-5"><div className="mb-4 flex items-center gap-2 font-bold"><Flame className="h-5 w-5 text-orange-500"/>หัวข้อฮอตฮิต</div>{topics.map((x,i)=><div key={x} className="mb-2 flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">{i+1}</span>{x}</div>)}</div>
          <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-700 p-6 text-white"><Target className="h-8 w-8"/><h3 className="mt-4 text-xl font-bold">อยากเก่งขึ้นอีกขั้น?</h3><p className="mt-2 text-sm text-white/75">อ่านจบแล้วฝึกข้อสอบเรื่องที่เกี่ยวข้องทันที</p><Link href="/ple/practice" className="mt-5 flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-800">ไปยังชุดข้อสอบ <ArrowRight className="ml-2 h-4 w-4"/></Link></div>
        </aside>
      </div>
      <section className="mt-14"><h2 className="mb-4 text-xl font-bold">อัปเดตวงการสุขภาพ</h2><div className="overflow-hidden rounded-3xl border"><GoodyEmbed site="health" type="news" title="ข่าวสารสุขภาพ"/></div></section>
    </main>
  </div>;
}