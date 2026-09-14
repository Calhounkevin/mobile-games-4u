import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";
import rawGamesData from "@/data/games.json";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/$/, "");
  const now = new Date();

  // Root Homepage
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Programmatic SEO: Add every game url so search engines index all games
  if (Array.isArray(rawGamesData)) {
    rawGamesData.forEach((game: { slug?: string; id?: string }) => {
      const slugOrId = game.slug || game.id;
      if (slugOrId) {
        entries.push({
          url: `${baseUrl}/?game=${encodeURIComponent(slugOrId)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });
  }

  return entries;
}
