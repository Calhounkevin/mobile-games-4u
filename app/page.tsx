'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { GAMES_DATA, GameItem } from '@/lib/games-data';
import { SITE_CONFIG } from '@/lib/config';
import { GameCard } from '@/components/GameCard';
import { DownloadModal } from '@/components/DownloadModal';
import { RecentDownloadsTicker } from '@/components/RecentDownloadsTicker';
import { WebsiteLogo } from '@/components/WebsiteLogo';
import { LiveOnlineBadge } from '@/components/LiveOnlineBadge';
import {
  Search,
  Flame,
  ShieldCheck,
  Zap,
  Lock,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useActiveGames } from '@/lib/storage-store';

function HomePageContent() {
  const gamesList = useActiveGames();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameForModal, setSelectedGameForModal] = useState<GameItem | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Auto-open game modal if URL has ?game=slug-or-id (Enables programmatic SEO & direct share links)
  useEffect(() => {
    const t = setTimeout(() => {
      const gameParam = searchParams.get('game');
      if (gameParam && gamesList.length > 0) {
        const targetGame = gamesList.find(
          (g) => g.slug === gameParam || g.id === gameParam || g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === gameParam
        );
        if (targetGame) {
          setSelectedGameForModal(targetGame);
        }
      }
    }, 0);
    return () => clearTimeout(t);
  }, [searchParams, gamesList]);

  // Dynamically extract game genres directly from the actual games in the list
  const dynamicCategories = useMemo(() => {
    const categorySet = new Set<string>();
    gamesList.forEach((game) => {
      if (game.category && game.category.trim().length > 0) {
        categorySet.add(game.category.trim());
      }
    });
    return Array.from(categorySet).sort();
  }, [gamesList]);

  // Filter games based on title search and category
  const filteredGames = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return gamesList.filter((game) => {
      // Strict title matching:
      // either the full title includes the clean query, or every individual word in the query matches the title
      if (cleanQuery) {
        const titleLower = game.title.toLowerCase();
        const queryWords = cleanQuery.split(/\s+/).filter(Boolean);
        const matchesTitle =
          titleLower.includes(cleanQuery) ||
          queryWords.every((word) => titleLower.includes(word));

        if (!matchesTitle) return false;
      }

      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Hot') return game.isHot;
      return game.category === selectedCategory;
    });
  }, [gamesList, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#e2e8f0] flex flex-col selection:bg-[#10b981]/30 selection:text-[#10b981]">
      {/* Live notification ticker */}
      <RecentDownloadsTicker />

      {/* Main Header / Navigation with Flat Vector Logo and High-Visibility Live Online Badge */}
      <header className="sticky top-0 z-40 bg-[#0d1422]/95 backdrop-blur-md border-b border-[#1b263b] px-4 py-3 shadow-md shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="flex items-center group">
            <WebsiteLogo size="md" />
          </Link>
          <div className="flex items-center shrink-0">
            <LiveOnlineBadge />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-8 pb-10 sm:py-12 px-4 bg-[#0d1422] border-b border-[#1b263b]">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-5">
          {/* Trust Tags */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a2638] border border-[#10b981]/40 text-xs font-semibold text-[#10b981]">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Virus Scanned
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a2638] border border-[#10b981]/40 text-xs font-semibold text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" /> 100% Free APKs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a2638] border border-[#2a3a52] text-xs font-semibold text-[#cbd5e1]">
              <Lock className="w-4 h-4 text-[#38bdf8]" /> 256-Bit Encrypted
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1a2638] border border-[#2a3a52] text-xs font-semibold text-[#cbd5e1]">
              <Zap className="w-4 h-4 text-[#fbbf24]" /> No Root / Jailbreak
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#ffffff] tracking-tight leading-tight">
            Download Free <span className="text-[#10b981]">Modded Games</span> & APKs
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Get unlimited dice, gems, coins, and unlocked features for your favorite mobile games. 
            Compatible with Android & iOS with zero root or jailbreak required.
          </p>

          {/* Search Bar - Real-time typing & immediate result display */}
          <div className="max-w-xl mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#94a3b8] absolute left-4 pointer-events-none" />
              <input
                id="search-games-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  // When user starts typing a search query, show results across all categories
                  if (selectedCategory !== 'All' && val.trim().length > 0) {
                    setSelectedCategory('All');
                  }
                }}
                placeholder="Search games by title, e.g. Monopoly GO, Roblox, Brawl Stars..."
                className="w-full pl-11 pr-20 py-3.5 rounded-xl bg-[#162133] border border-[#2a3a52] text-[#ffffff] placeholder-[#64748b] text-sm focus:outline-none focus:border-[#10b981] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 px-2.5 py-1 text-xs rounded-lg bg-[#111a28] text-[#cbd5e1] hover:text-[#ffffff] border border-[#27374e] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills - Only shows categories that actually exist in the games list */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#10b981] text-[#ffffff] shadow-md shadow-[#10b981]/25'
                  : 'bg-[#1a2638] text-[#cbd5e1] hover:bg-[#202f45] border border-[#2a3a52]'
              }`}
            >
              All Games ({GAMES_DATA.length})
            </button>

            <button
              onClick={() => setSelectedCategory('Hot')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCategory === 'Hot'
                  ? 'bg-[#ef4444] text-[#ffffff] shadow-md shadow-[#ef4444]/25'
                  : 'bg-[#1a2638] text-[#ef4444] hover:bg-[#202f45] border border-[#ef4444]/40'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-[#ef4444]" /> Hot Games
            </button>

            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#10b981] text-[#ffffff] shadow-md shadow-[#10b981]/25'
                    : 'bg-[#1a2638] text-[#cbd5e1] hover:bg-[#202f45] border border-[#2a3a52]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Multi-Games Grid Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:py-12 space-y-12">
        <div>
          {/* Header row with count */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#ffffff] flex items-center gap-2.5">
                <span>{searchQuery.trim() ? `Search Results for "${searchQuery.trim()}"` : 'Featured Modded Games'}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold">
                  {filteredGames.length} Available
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                {searchQuery.trim() 
                  ? `Showing games with title matching "${searchQuery.trim()}"`
                  : 'Click any game card to open the direct package overview'}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs text-[#10b981] hover:underline font-semibold cursor-pointer"
              >
                Reset search
              </button>
            )}
          </div>

          {/* Games Grid Container */}
          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelectGame={(g) => setSelectedGameForModal(g)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-2xl bg-[#1a2638] border border-[#2a3a52] space-y-3">
              <div className="text-3xl">🔍</div>
              <h3 className="text-base font-bold text-[#ffffff]">
                No modded games found with title matching &quot;{searchQuery}&quot;
              </h3>
              <p className="text-xs text-[#94a3b8] max-w-sm mx-auto">
                Check your spelling or browse games by category above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-lg bg-[#111a28] hover:bg-[#202f45] text-xs text-[#ffffff] font-semibold border border-[#27374e] cursor-pointer"
              >
                View All Games
              </button>
            </div>
          )}
        </div>

        {/* High Conversion Trust & Security Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl bg-[#1a2638] border border-[#2a3a52] space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#111a28] border border-[#10b981]/30 text-[#10b981] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#ffffff]">100% Virus & Malware Checked</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Every APK is checked by automated sandboxes with 0/64 signature detections before release.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#1a2638] border border-[#2a3a52] space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#111a28] border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#ffffff]">Anti-Ban Protection Protocol</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Our client mods use request spoofing to mirror standard in-app purchases so your connected accounts remain safe.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#1a2638] border border-[#2a3a52] space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#111a28] border border-[#fbbf24]/30 text-[#fbbf24] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#ffffff]">No Root or Jailbreak Needed</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Enjoy plug-and-play installation on any standard stock Android or iOS mobile phone with 1-tap installation.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#1a2638] border border-[#2a3a52] space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-[#ffffff]">
              How to Download & Install Modded Mobile Games
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Follow these 3 quick steps to unlock unlimited gems and features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#111a28] border border-[#27374e] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#10b981] text-[#ffffff] font-black text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold text-[#ffffff]">Pick Your Game</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Click any game card above or search for your favorite title to open the package overview.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111a28] border border-[#27374e] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#10b981] text-[#ffffff] font-black text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-[#ffffff]">Verify Your Device</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Complete one quick sponsored security check to unlock the direct cloud mirror.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111a28] border border-[#27374e] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#10b981] text-[#ffffff] font-black text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold text-[#ffffff]">Install & Enjoy</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Open the downloaded APK or iOS package and enjoy your unlocked gems and features!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-[#ffffff]">Frequently Asked Questions</h2>
            <p className="text-xs text-[#94a3b8]">Everything you need to know about our modded games</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-2.5">
            {[
              {
                q: 'Are these modded games free to download?',
                a: 'Yes, 100% free. You will never be asked for credit card details. To keep our high-speed CDN servers online, downloads are protected by quick sponsored app verification.'
              },
              {
                q: 'Do I need to root my Android phone or jailbreak my iPhone?',
                a: 'No! All mods provided on mobilegames4u.space are pre-signed and packaged to run on stock, non-rooted Android devices (via standard APK) and unmodified iOS devices.'
              },
              {
                q: 'Why do I need to complete verification?',
                a: 'To prevent automated scraping bots and DDoS leechers from exhausting our high-speed cloud mirrors, we use a quick verification gateway. Completing one brief sponsored action instantly unlocks your clean file download.'
              },
              {
                q: 'Will I get banned from online multiplayer games?',
                a: 'Our modifications include custom packet masking and anti-ban proxies that simulate standard client requests. However, for games with leaderboard rankings, we always suggest using an alt account to be 100% safe.'
              },
              {
                q: 'How do I update when a new game version comes out?',
                a: 'Simply bookmark mobilegames4u.space and return here. We update all game packages within 24 hours of official game releases.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#1a2638] border border-[#2a3a52] overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left text-xs sm:text-sm font-bold text-[#ffffff] flex items-center justify-between gap-3 hover:bg-[#202f45] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#94a3b8] transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-[#10b981]' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-[#cbd5e1] leading-relaxed border-t border-[#27374e]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Centered Clean Footer */}
      <footer className="bg-[#0b1019] border-t border-[#1b263b] py-8 px-4 text-xs text-[#94a3b8]">
        <div className="max-w-7xl mx-auto space-y-6 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Link href="/" className="flex items-center group">
              <WebsiteLogo size="sm" />
            </Link>
            <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
              <p className="text-xs text-[#94a3b8]">
                Official domain: <span className="text-[#10b981] font-mono">{SITE_CONFIG.domain}</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1b263b] text-[11px] text-[#64748b] space-y-2 leading-relaxed max-w-3xl mx-auto">
            <p>
              <strong>Disclaimer:</strong> {SITE_CONFIG.name} is a curation platform for community game utilities, modifications, and tutorials for educational and testing purposes. All registered trademarks, game titles, and logos belong to their respective developers and publishers. We do not host copyrighted files on our origin servers. All download links redirect to third-party verification lockers.
            </p>
            <p className="text-[#64748b]">
              © {new Date().getFullYear()} mobilegames4u.space • All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Download Modal Popup */}
      <DownloadModal
        game={selectedGameForModal}
        onClose={() => setSelectedGameForModal(null)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f18]" />}>
      <HomePageContent />
    </Suspense>
  );
}

