import type { MetadataRoute } from "next";
import { getQuestionSets } from "@/lib/db/queries-mcq";

const BASE_URL = "https://pharmru.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/sets`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ple`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/ple/practice`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/ple/mock`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/nursing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/nursing/practice`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/nursing/mock`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Dynamic: each active question set has its own product page
  let setRoutes: MetadataRoute.Sitemap = [];
  try {
    const sets = await getQuestionSets();
    setRoutes = sets.map((s) => ({
      url: `${BASE_URL}/sets/${s.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sitemap shouldn't fail if DB is unreachable; fall back to static routes only.
  }

  return [...staticRoutes, ...setRoutes];
}
