import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/blog";
import { ArrowLeft, ArrowRight, Brain, Clock3, Lightbulb, Sparkles, Target } from "lucide-react";

export const revalidate = 3600;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return <div className="min-h-screen bg-slate-50/60">
    <header className="border-b bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700"><ArrowLeft className="h-4 w-4"/>กลับคลังทบทวน</Link>
        <div className="mt-7 flex flex-wrap items-center gap-2 text-sm">{post.category&&<span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">{post.category}</span>}<span className="flex items-center gap-1.5 text-slate-500"><Clock3 className="h-4 w-4"/>{post.reading_time} นาที</span><span className="text-slate-400">•</span><span className="text-slate-500">{new Date(post.published_at).toLocaleDateString("th-TH")}</span></div>
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">{post.title}</h1>
        {post.description&&<p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{post.description}</p>}
        <div className="mt-7 flex flex-wrap gap-2">{["Concept","Exam Pearl","จุดหลอก","ตัวอย่างข้อสอบ"].map(x=><span key={x} className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm font-medium">✓ {x}</span>)}</div>
      </div>
    </header>

    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
      <article className="min-w-0">
        {post.cover_image&&<img src={post.cover_image} alt={post.title} className="mb-7 max-h-[440px] w-full rounded-3xl border object-cover shadow-sm"/>}
        <div className="mb-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4"><Brain className="h-5 w-5 text-emerald-700"/><b className="mt-2 block">เข้าใจ Concept</b><span className="text-xs text-slate-500">จับหลักให้ได้ก่อนจำ</span></div>
          <div className="rounded-2xl border bg-white p-4"><Lightbulb className="h-5 w-5 text-amber-500"/><b className="mt-2 block">Exam Pearl</b><span className="text-xs text-slate-500">ประเด็นที่ชอบออกสอบ</span></div>
          <div className="rounded-2xl border bg-white p-4"><Target className="h-5 w-5 text-rose-500"/><b className="mt-2 block">ฝึกต่อทันที</b><span className="text-xs text-slate-500">เชื่อมกลับไปยัง Qbank</span></div>
        </div>
        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-9">
          <div className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-h2:mt-10 prose-h2:border-l-4 prose-h2:border-emerald-500 prose-h2:pl-4 prose-h3:text-emerald-800 prose-p:leading-8 prose-a:text-emerald-700 prose-strong:text-slate-900 prose-blockquote:rounded-2xl prose-blockquote:border-emerald-400 prose-blockquote:bg-emerald-50 prose-blockquote:px-5 prose-blockquote:py-2 prose-li:my-1" dangerouslySetInnerHTML={{__html:post.content}}/>
        </div>
        <div className="mt-7 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-700 p-7 text-white">
          <div className="flex items-center gap-2 font-semibold text-emerald-100"><Sparkles className="h-5 w-5"/>อ่านจบแล้ว อย่าหยุดแค่จำ</div>
          <h2 className="mt-2 text-2xl font-bold">ลองทำข้อสอบเพื่อเช็กความเข้าใจ</h2>
          <p className="mt-2 text-sm text-white/75">ฝึกโจทย์จริงและดูเฉลยละเอียด เพื่อเปลี่ยนความรู้ให้เป็นคะแนน</p>
          <Link href="/ple/practice" className="mt-5 inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-emerald-800">ฝึกข้อสอบเรื่องนี้ <ArrowRight className="ml-2 h-4 w-4"/></Link>
        </div>
      </article>
      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border bg-white p-5 shadow-sm"><div className="flex items-center gap-2 font-bold"><Lightbulb className="h-5 w-5 text-amber-500"/>วิธีอ่านให้คุ้ม</div><ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600"><li>1. อ่าน Concept ให้เข้าใจก่อน</li><li>2. จับ Exam Pearl และจุดหลอก</li><li>3. ปิดบทความแล้วลองอธิบายเอง</li><li>4. ทำข้อสอบทันทีเพื่อทดสอบ</li></ol></div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5"><Target className="h-6 w-6 text-emerald-700"/><h3 className="mt-3 font-bold">พร้อมทดสอบตัวเอง?</h3><p className="mt-2 text-sm leading-6 text-slate-600">Practice Mode ช่วยดูว่าจุดไหนยังต้องทบทวน</p><Link href="/ple/practice" className="mt-4 flex items-center font-semibold text-emerald-700">เริ่มทำข้อสอบ <ArrowRight className="ml-2 h-4 w-4"/></Link></div>
      </aside>
    </main>
  </div>;
}