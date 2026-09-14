import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/adminBlack"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
