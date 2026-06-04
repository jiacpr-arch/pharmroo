import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogPost } from "@/lib/blog";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "ไม่พบบทความ" };

  return {
    title: post.title,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: "article",
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/blog"
          className="text-brand hover:underline text-sm mb-6 inline-block"
        >
          ← กลับหน้าบทความ
        </Link>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full aspect-[1200/630] object-cover rounded-2xl mb-7 shadow-sm"
          />
        )}

        <div className="flex items-center flex-wrap gap-3 text-sm text-gray-400 mb-4">
          {post.category && (
            <span className="bg-brand/10 text-brand font-medium px-3 py-1 rounded-full text-xs">
              {post.category}
            </span>
          )}
          <span>⏱️ อ่าน {post.reading_time} นาที</span>
          <span>{new Date(post.published_at).toLocaleDateString("th-TH")}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-snug text-gray-900">
          {post.title}
        </h1>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 rounded-2xl bg-brand/5 border border-brand/15 p-6 text-center">
          <p className="font-semibold text-gray-800 mb-1">
            อยากสอบใบประกอบเภสัชกรให้ผ่าน? 💊
          </p>
          <p className="text-sm text-gray-500 mb-4">
            ฝึกข้อสอบเสมือนจริง พร้อมเฉลยละเอียดกับ PharmRu
          </p>
          <Link
            href="/ple"
            className="inline-block bg-brand text-white font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition"
          >
            เริ่มติวฟรี
          </Link>
        </div>
      </article>
    </div>
  );
}
