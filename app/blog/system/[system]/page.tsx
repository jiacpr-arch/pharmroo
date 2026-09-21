import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/blog";
import { clinicalSystems, getClinicalSystem, postMatchesSystem } from "@/lib/clinical-systems";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Sparkles, Target } from "lucide-react";

export const dynamic="force-dynamic";

export default async function ClinicalReviewPage({params}:{params:Promise<{system:string}>}){
  const {system:slug}=await params;
  const system=getClinicalSystem(slug);
  if(!system) notFound();
  const all=await getBlogPosts(100).catch(()=>[]);
  const posts=all.filter(p=>postMatchesSystem(p,system));
  return <div className="min-h-screen bg-white">
    <section className={`border-b bg-gradient-to-br ${system.tone}`}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><ArrowLeft className="h-4 w-4"/>กลับคลังทบทวน</Link>
        <div className="mt-7 flex items-start gap-5"><div className="text-6xl">{system.icon}</div><div><div className="text-sm font-semibold text-emerald-700">Clinical Review</div><h1 className="mt-1 text-4xl font-bold text-slate-900 sm:text-5xl">{system.name}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{system.description}</p></div></div>
        <div className="mt-8 flex flex-wrap gap-2">{system.topics.map(t=><span key={t} className="rounded-xl border bg-white px-4 py-2 text-sm font-medium text-slate-700">{t}</span>)}</div>
      </div>
    </section>
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-end justify-between"><div><div className="flex items-center gap-2 font-semibold text-emerald-700"><Sparkles className="h-5 w-5"/>ทบทวนจากข้อสอบ</div><h2 className="mt-1 text-3xl font-bold">บทความในหมวดนี้</h2></div><Link href="/ple/practice" className="hidden items-center text-sm font-semibold text-emerald-700 sm:flex">ไปฝึกข้อสอบ <ArrowRight className="ml-2 h-4 w-4"/></Link></div>
      {posts.length===0?<div className="rounded-3xl border border-dashed bg-slate-50 p-12 text-center"><BookOpen className="mx-auto h-9 w-9 text-slate-300"/><h3 className="mt-4 font-bold text-slate-700">กำลังเพิ่มบททบทวนในหมวดนี้</h3><p className="mt-2 text-sm text-slate-500">ระหว่างนี้สามารถฝึกข้อสอบที่เกี่ยวข้องใน Qbank ได้ก่อน</p><Link href="/ple/practice" className="mt-5 inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white">ไปฝึกข้อสอบ <ArrowRight className="ml-2 h-4 w-4"/></Link></div>:
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.map(p=><Link key={p.id} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">{p.cover_image?<img src={p.cover_image} alt={p.title} className="h-44 w-full object-cover"/>:<div className={`flex h-44 items-center justify-center bg-gradient-to-br ${system.tone} text-6xl`}>{system.icon}</div>}<div className="p-5"><div className="flex items-center gap-2 text-xs text-slate-400"><span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{p.category||system.name}</span><Clock3 className="h-3.5 w-3.5"/>{p.reading_time} นาที</div><h3 className="mt-3 line-clamp-2 text-lg font-bold leading-7 group-hover:text-emerald-700">{p.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{p.description}</p><div className="mt-5 flex items-center font-semibold text-emerald-700">อ่านทบทวน <ArrowRight className="ml-2 h-4 w-4"/></div></div></Link>)}</div>}
      <section className="mt-12 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-700 p-7 text-white"><Target className="h-7 w-7"/><h2 className="mt-3 text-2xl font-bold">อ่านแล้วต้องลองทำโจทย์</h2><p className="mt-2 text-white/75">ใช้ Practice Mode เพื่อเช็กว่าจำ Concept และแยกตัวเลือกหลอกได้จริงหรือยัง</p><Link href="/ple/practice" className="mt-5 inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-emerald-800">เริ่มฝึกข้อสอบ <ArrowRight className="ml-2 h-4 w-4"/></Link></section>
    </main>
  </div>;
}

export function generateStaticParams(){return clinicalSystems.map(s=>({system:s.slug}));}