import type { Metadata } from "next";
import { getBlogIndexPosts } from "@/lib/blog";
import BlogLibrary from "./BlogLibrary";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ห้องสมุดความรู้เภสัช | PharmRu Blog",
  description:
    "เลือกอ่านบทความเภสัช ทบทวนแนวคิดสำคัญก่อนสอบ PLE และค้นหาความรู้ตามโรคและระบบที่สนใจ",
};

export default async function BlogPage() {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.PHARMRU_BLOG_PREVIEW === "1"
  ) {
    const { default: sample } =
      await import("@/scripts/blog-posts/ple-high-risk-drug-classes-review.json");
    return (
      <>
        <div
          style={{
            background: "#f3eed8",
            padding: "8px 20px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          พรีวิวดีไซน์ · ใช้บทความตัวอย่างจากโปรเจกต์
        </div>
        <BlogLibrary
          posts={[
            {
              id: "preview",
              slug: sample.slug,
              title: sample.title,
              description: sample.description,
              category: sample.category,
              cover_image: "/blog/ple-high-risk-drug-classes-review.jpg",
              reading_time: 3,
            },
          ]}
          unavailable={false}
        />
      </>
    );
  }
  let unavailable = false;
  const posts = await getBlogIndexPosts().catch(() => {
    unavailable = true;
    return [];
  });
  return <BlogLibrary posts={posts} unavailable={unavailable} />;
}
