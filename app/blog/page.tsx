import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import GoodyEmbed from "@/components/GoodyEmbed";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">บทความ PharmRoo</h1>
        <p className="text-gray-500 mb-8">
          ความรู้เภสัชกรรม เทคนิคการสอบ และข่าวสารวงการ
        </p>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">ข่าวสารสุขภาพ</h2>
          <div className="overflow-hidden rounded-xl border bg-white">
            <GoodyEmbed site="health" type="news" title="ข่าวสารสุขภาพ" />
          </div>
        </section>

        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-20">
            ยังไม่มีบทความ กำลังมาเร็วๆ นี้
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 block"
              >
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  {post.category && (
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                      {post.category}
                    </span>
                  )}
                  <span>{post.reading_time} นาที</span>
                </div>
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                {post.description && (
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {post.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
