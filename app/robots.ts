import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/nursing/admin",
          "/nursing/admin/",
          "/onboarding",
          "/profile",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://pharmru.com/sitemap.xml",
    host: "https://pharmru.com",
  };
}
