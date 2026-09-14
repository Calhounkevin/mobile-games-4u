// Configuration for mobilegames4u CPA Landing Page

export const SITE_CONFIG = {
  name: "mobilegames4u",
  domain: "www.mobilegames4u.space",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.mobilegames4u.space",
  title: "mobilegames4u - Free Modded Games & APK Downloads (Android & iOS)",
  description: "Download verified modded mobile games and APKs with unlimited money, gems, unlocked features, and no root/jailbreak required. Fast and safe CDN downloads.",
  
  // Default OgAds CPA Content Locker URL
  // Replace this with your own OgAds content locker link from your OgAds dashboard!
  // Example: https://locked4.com/cl/i/abc123xyz or your custom OgAds landing page URL
  defaultOgAdsUrl: process.env.NEXT_PUBLIC_OGADS_LOCKER_URL || "https://locked4.com/cl/i/mobilegames4u_demo",

  // Telegram / Discord community or support link (optional)
  telegramChannel: "https://t.me/mobilegames4u",

  // Analytics or verification (optional)
  googleSiteVerification: "",
};

// Helper to get active locker URL (prioritizes localStorage if set by site owner in preview)
export function getLockerUrl(customParam?: string): string {
  if (typeof window !== "undefined") {
    const savedUrl = localStorage.getItem("mobilegames4u_ogads_url");
    if (savedUrl && savedUrl.trim().length > 0) {
      return customParam ? `${savedUrl}?subid=${encodeURIComponent(customParam)}` : savedUrl;
    }
  }
  const base = SITE_CONFIG.defaultOgAdsUrl;
  return customParam ? `${base}?subid=${encodeURIComponent(customParam)}` : base;
}
