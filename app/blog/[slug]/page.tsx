import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/blog";
import { ArrowLeft, ArrowRight, Bookmark, Brain, CheckCircle2, Clock3, Lightbulb, Share2, Sparkles, Target } from "lucide-react";

export const revalidate=3600;

export default async function BlogPostPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const post=await getBlogPost(slug); if(!post) notFound();
 return <div className="min-h-screen bg-white">
  <header className="border-b bg-gradient-to-br from-rose-50 via-white to-emerald-50">
   <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><ArrowLeft className="h-4 w-4"/>บทความทบทวน</Link>
    <div className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
     <div>
      <div className="flex flex-wrap gap-2">{post.category&&<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">{post.category}</span>}<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Clinical Review</span></div>
      <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">{post.title}</h1>
      {post.description&&<p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{post.description}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500"><span>👨‍⚕️ PharmRU Team</span><span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4"/>{post.reading_time} นาที</span><span>{new Date(post.published_at).toLocaleDateString("th-TH")}</span></div>
     </div>
     <div className="relative min-h-64 overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-rose-100 via-pink-50 to-white p-7 shadow-sm">
      {post.cover_image?<img src={post.cover_image} alt={post.title} className="absolute inset-0 h-full w-full object-cover"/>:<><div className="absolute right-8 top-6 text-8xl">❤️</div><div className="absolute bottom-6 right-12 space-y-2">{["ACE Inhibitors","ARBs","Beta-blockers","Diuretics"].map(x=><div key={x} className="rounded-lg border bg-white/90 px-5 py-2 text-sm font-semibold shadow-sm">{x}</div>)}</div><div className="absolute left-7 top-8 rotate-[-4deg] rounded-lg bg-amber-50 p-4 font-medium text-slate-600 shadow-sm">Same Concepts<br/>New Confidence :)</div></>}
     </div>
    </div>
   </div>
  </header>

  <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
   <div className="mb-7 flex flex-col justify-between gap-4 rounded-2xl bg-rose-50 p-5 sm:flex-row sm:items-center">
    <p className="font-semibold text-rose-800">“เข้าใจกลไก → จำผลข้างเคียง → ระวังจุดหลอก → ทำข้อสอบได้จริง”</p>
    <div className="flex gap-2"><Link href="/ple/practice" className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white">ฝึกข้อสอบเรื่องนี้ <ArrowRight className="ml-2 h-4 w-4"/></Link><button className="rounded-xl border bg-white p-3"><Bookmark className="h-5 w-5"/></button><button className="rounded-xl border bg-white p-3"><Share2 className="h-5 w-5"/></button></div>
   </div>

   <div className="mb-7 grid gap-4 lg:grid-cols-3">
    <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6"><div className="flex items-center gap-2"><Lightbulb className="h-6 w-6 text-amber-500"/><h2 className="text-xl font-bold">Key Takeaways</h2></div><div className="mt-4 space-y-3">{["จับกลไกหลักให้ได้ก่อนจำชื่อยา","เชื่อมกลไกกับ adverse effects","จำ interaction และ contraindications","อ่านแล้วทำโจทย์ต่อทันที"].map(x=><div key={x} className="flex gap-2 text-sm leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600"/>{x}</div>)}</div></section>
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6"><div className="flex items-center gap-2"><Brain className="h-6 w-6 text-emerald-700"/><h2 className="text-xl font-bold">วิธีอ่านบทนี้</h2></div><ol className="mt-4 space-y-2 text-sm leading-6 text-slate-700"><li>1. กลไกการออกฤทธิ์</li><li>2. ข้อบ่งใช้ทางคลินิก</li><li>3. ยาสำคัญที่ต้องรู้</li><li>4. ผลข้างเคียงและข้อควรระวัง</li><li>5. จุดหลอกที่ออกสอบบ่อย</li><li>6. ตัวอย่างข้อสอบและเฉลย</li></ol></section>
    <section className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-6 text-center"><div className="text-4xl">💚</div><p className="mt-4 text-2xl font-semibold leading-9 text-emerald-800">“ยาที่ดี...<br/>เมื่อรู้วิธีใช้<br/>และรู้ข้อจำกัด”</p><span className="mt-4 text-xs font-bold text-emerald-700">PHARMRU</span></section>
   </div>

   <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
    <article className="min-w-0">
     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
      <div className="study-article" dangerouslySetInnerHTML={{__html:post.content}}/>
     </div>
     <div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6"><div className="font-bold text-emerald-800">🧠 สรุปจำก่อนสอบ</div><p className="mt-3 text-sm leading-7 text-slate-700">อ่าน Concept ให้เข้าใจ แล้วจำเฉพาะ keyword ที่เชื่อมกลไก ผลข้างเคียง และ interaction เข้าด้วยกัน</p></div><div className="rounded-3xl border border-rose-100 bg-rose-50 p-6"><div className="font-bold text-rose-700">🎯 จำด้วยคำสำคัญ</div><p className="mt-3 text-sm leading-7 text-slate-700">สร้าง mnemonic สั้น ๆ ของตัวเอง แล้วทดสอบด้วยโจทย์ทันทีเพื่อให้จำได้นานขึ้น</p></div></div>
     <section className="mt-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-700 p-7 text-white"><Sparkles className="h-6 w-6"/><h2 className="mt-3 text-2xl font-bold">พร้อมเช็กความเข้าใจ?</h2><p className="mt-2 text-white/75">ไปทำ Practice Mode แล้วกลับมาทบทวนเฉพาะจุดที่ตอบผิด</p><Link href="/ple/practice" className="mt-5 inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-emerald-800">ฝึกข้อสอบเรื่องนี้ <ArrowRight className="ml-2 h-4 w-4"/></Link></section>
    </article>
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start"><div className="rounded-3xl border bg-slate-50 p-5"><div className="font-bold">📚 สารบัญ</div>{["Concept","ข้อบ่งใช้","ยาที่ต้องรู้","ผลข้างเคียง","จุดหลอก","ตัวอย่างข้อสอบ","สรุป"].map((x,i)=><div key={x} className="mt-3 flex items-center gap-3 text-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500">{i+1}</span>{x}</div>)}</div><div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5"><Target className="h-6 w-6 text-emerald-700"/><h3 className="mt-3 font-bold">อย่าอ่านอย่างเดียว</h3><p className="mt-2 text-sm leading-6 text-slate-600">ทำโจทย์ต่อทันทีเพื่อดูว่าเข้าใจจริงหรือยัง</p></div></aside>
   </div>

   <section className="mt-12"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">🔗 บทความที่เกี่ยวข้อง</h2><Link href="/blog" className="text-sm font-semibold text-emerald-700">ดูบทความทั้งหมด →</Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["💊","ARBs","ทางเลือกเมื่อไอจาก ACEI"],["⚪","Thiazide Diuretics","ยาขับปัสสาวะที่ออกสอบบ่อย"],["β","Beta-blockers","ใช้ในโรคหัวใจอย่างไร"],["❤️","Heart Failure","ยาหลักที่ต้องรู้"],["🫘","CKD","การปรับขนาดยาในผู้ป่วยไตเสื่อม"]].map(([icon,title,desc])=><Link href="/blog" key={title} className="rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"><div className="text-4xl">{icon}</div><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p><div className="mt-4 text-emerald-700">→</div></Link>)}</div></section>
  </main>
 </div>;
}