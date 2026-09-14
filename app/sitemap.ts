import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/$/, "");
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];
}
