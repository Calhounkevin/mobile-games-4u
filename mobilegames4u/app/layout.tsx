import type { Metadata } from 'next';
import './globals.css';
import { SITE_CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: 'mobilegames4u - Download Modded Mobile Games & Free APKs',
    template: '%s | mobilegames4u',
  },
  description:
    'Download verified modded mobile games and APKs for Android & iOS with unlimited gems, coins, and unlocked features. Fast CDN delivery and virus checked.',
  keywords: [
    'mobilegames4u',
    'mod apk download',
    'unlimited gems games',
    'modded mobile games',
    'android apk mod',
    'ios ipa mod',
    'free mobile games mods',
    'monopoly go free dice mod',
    'brawl stars nulls apk',
  ],
  authors: [{ name: 'mobilegames4u Team' }],
  creator: 'mobilegames4u',
  publisher: 'mobilegames4u',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_CONFIG.siteUrl,
  },
  openGraph: {
    title: 'mobilegames4u - Download Modded Mobile Games & Free APKs',
    description:
      'Verified modded mobile games with unlimited resources. Android APK and iOS compatible. Instant safe downloads.',
    url: SITE_CONFIG.siteUrl,
    siteName: 'mobilegames4u',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mobilegames4u - Modded Mobile Games & Free APKs',
    description:
      'Download working modded games with unlimited dice, gems, coins, and unlocked skins.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'mobilegames4u',
    url: SITE_CONFIG.siteUrl,
    description:
      'High-converting modded mobile games catalog with fast direct APK downloads.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0a0f18] text-[#e2e8f0] antialiased selection:bg-[#10b981]/30 selection:text-[#10b981]">
        {children}
      </body>
    </html>
  );
}
