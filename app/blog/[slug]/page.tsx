import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/blog";

export const revalidate = 3600;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/blog"
          className="text-blue-500 hover:text-blue-600 text-sm mb-6 inline-block"
        >
          ← กลับหน้าบทความ
        </Link>

        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
          {post.category && (
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
              {post.category}
            </span>
          )}
          <span>{post.reading_time} นาที</span>
          <span>
            {new Date(post.published_at).toLocaleDateString("th-TH")}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
