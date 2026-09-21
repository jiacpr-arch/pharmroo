import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import GoodyEmbed from "@/components/GoodyEmbed";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);

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
          <div className="space-y-8">
            {/* Featured: newest post, full width to match the news section above */}
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
            >
              {posts[0].cover_image && (
                <img
                  src={posts[0].cover_image}
                  alt={posts[0].title}
                  className="h-56 w-full object-cover sm:h-72"
                />
              )}
              <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
                  {posts[0].category && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                      {posts[0].category}
                    </span>
                  )}
                  <span>{posts[0].reading_time} นาที</span>
                </div>
                <h2 className="mb-2 text-xl font-semibold group-hover:text-blue-600 sm:text-2xl">
                  {posts[0].title}
                </h2>
                {posts[0].description && (
                  <p className="line-clamp-3 text-gray-500">
                    {posts[0].description}
                  </p>
                )}
              </div>
            </Link>

            {posts.length > 1 && (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.slice(1).map((post) => (
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
        )}
      </div>
    </div>
  );
}
