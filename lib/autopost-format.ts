import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export type AutopostFormat = "cover_caption" | "quote_card" | "link_only";

const FORMATS: AutopostFormat[] = ["cover_caption", "quote_card", "link_only"];

export async function pickAutopostFormat(): Promise<AutopostFormat> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(sql`autopost_format IS NOT NULL`)
    .then((r) => r[0]?.count ?? 0);

  return FORMATS[result % FORMATS.length];
}

const CATEGORY_HASHTAGS: Record<string, string> = {
  pharmacotherapy: "#เภสัชบำบัด #Pharmacotherapy",
  "pharma-tech": "#เภสัชเทคโนโลยี #PharmTech",
  "pharma-chem": "#เภสัชเคมี #PharmChem",
  "pharma-analysis": "#เภสัชวิเคราะห์",
  pharmacokinetics: "#เภสัชจลนศาสตร์ #PK",
  "pharma-law": "#กฎหมายยา",
  herbal: "#สมุนไพร #Herbal",
};

export function categoryHashtag(category: string | null): string {
  if (!category) return "#PharmRoo #เภสัชศาสตร์";
  return (CATEGORY_HASHTAGS[category] ?? "#เภสัชศาสตร์") + " #PharmRoo #สอบเภสัช";
}
