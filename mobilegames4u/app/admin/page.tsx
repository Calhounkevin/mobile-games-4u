'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { WebsiteLogo } from '@/components/WebsiteLogo';
import { SITE_CONFIG } from '@/lib/config';
import { GAMES_DATA, GameItem } from '@/lib/games-data';
import {
  ArrowLeft,
  Link as LinkIcon,
  Plus,
  Trash2,
  Edit2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Save,
  Gamepad2,
  Flame,
  ShieldCheck,
  Globe,
  Settings,
  HelpCircle,
} from 'lucide-react';

import { useActiveGames, useActiveLockerUrl, saveLockerUrl, saveCustomGames } from '@/lib/storage-store';

export default function AdminDashboardPage() {
  const activeLocker = useActiveLockerUrl();
  const activeGames = useActiveGames();

  const [inputLockerUrl, setInputLockerUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGame, setEditingGame] = useState<Partial<GameItem> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Sync input field once activeLocker loads or changes, but only if user hasn't typed
  useEffect(() => {
    if (activeLocker) {
      // Use microtask or timeout to avoid synchronous setState inside effect body
      const t = setTimeout(() => {
        setInputLockerUrl((prev) => (prev ? prev : activeLocker));
      }, 0);
      return () => clearTimeout(t);
    }
  }, [activeLocker]);

  // Save locker URL
  const handleSaveLocker = (e: React.FormEvent) => {
    e.preventDefault();
    saveLockerUrl(inputLockerUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Filter games by search
  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return activeGames;
    const q = searchQuery.toLowerCase();
    return activeGames.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.developer.toLowerCase().includes(q)
    );
  }, [activeGames, searchQuery]);

  // Handle Save Game (create or edit)
  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame || !editingGame.title) return;

    let updatedList: GameItem[];

    if (isAddingNew) {
      const newId = (activeGames.length + 1).toString();
      const newSlug = (editingGame.title || 'game')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const fullNewGame: GameItem = {
        id: newId,
        slug: newSlug,
        name: editingGame.title,
        title: editingGame.title,
        category: editingGame.category || 'Action',
        version: editingGame.version || 'v1.0.0',
        rating: 4.8,
        reviewsCount: 1420,
        downloadsCount: '100K+',
        fileSize: editingGame.fileSize || '95 MB',
        requires: 'Android 7.0+',
        developer: editingGame.developer || 'Top Dev Studio',
        packageId: `com.mod.${newSlug}`,
        updatedDate: 'Just now',
        isHot: !!editingGame.isHot,
        accentColor: '#10b981',
        gradient: 'from-emerald-600 to-teal-800',
        iconUrl:
          editingGame.iconUrl ||
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200&q=80',
        imageLink:
          editingGame.iconUrl ||
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200&q=80',
        contentLockerLink: editingGame.contentLockerLink || '',
        modFeatures: editingGame.modFeatures || ['Unlimited Currency', 'All Unlocked'],
        shortDescription:
          editingGame.shortDescription || `Download ${editingGame.title} mod apk with unlocked features.`,
        fullDescription:
          editingGame.fullDescription ||
          `Get the verified, clean working version of ${editingGame.title} mod with free direct verification locker.`,
        featuresList: [
          { title: 'Unlimited Resources', description: 'Access unlimited in-game items instantly.' },
          { title: 'Clean & Safe', description: 'Verified against viruses and malware.' },
        ],
        installSteps: [
          'Click the green Download button.',
          'Complete the quick verification offer.',
          'Download and install APK.',
        ],
        faqs: [
          {
            question: 'Is root or jailbreak required?',
            answer: 'No, this works seamlessly on standard Android and iOS devices.',
          },
        ],
        seoKeywords: [editingGame.title, 'mod apk', 'free download'],
      };

      updatedList = [fullNewGame, ...activeGames];
    } else {
      updatedList = activeGames.map((g) =>
        g.id === editingGame.id ? ({ ...g, ...editingGame, title: editingGame.title! } as GameItem) : g
      );
    }

    saveCustomGames(updatedList);
    setEditingGame(null);
    setIsAddingNew(false);
  };

  // Delete game
  const handleDeleteGame = (id: string) => {
    if (confirm('Are you sure you want to remove this game from the catalog?')) {
      const updated = activeGames.filter((g) => g.id !== id);
      saveCustomGames(updated);
    }
  };

  // Download updated games.json
  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeGames, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'games.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeGames, null, 2));
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#e2e8f0] pb-20 selection:bg-[#10b981]/30 selection:text-[#10b981]">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#0d1422]/95 backdrop-blur-md border-b border-[#1b263b] px-4 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e30] border border-[#23354d] text-xs font-semibold text-[#cbd5e1] hover:text-[#ffffff] hover:border-[#10b981] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Site</span>
            </Link>
            <WebsiteLogo size="sm" showText={false} />
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#ffffff] tracking-tight">
                Website Backend & Dashboard
              </h1>
              <p className="text-[11px] text-[#94a3b8]">Control your locker link & game listings</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={inputLockerUrl || activeLocker}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-xs font-bold hover:bg-[#10b981]/25 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Current Locker</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0d1522] border border-[#1b263b] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#ffffff]">{activeGames.length}</div>
              <div className="text-xs text-[#94a3b8] font-medium">Total Games Listed</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1522] border border-[#1b263b] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">Active Locker</div>
              <div className="text-xs text-[#cbd5e1] truncate font-mono mt-0.5">
                {inputLockerUrl || activeLocker || 'Not configured'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1522] border border-[#1b263b] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#f59e0b]">Domain Target</div>
              <div className="text-xs text-[#cbd5e1] font-mono mt-0.5">{SITE_CONFIG.domain}</div>
            </div>
          </div>
        </div>

        {/* Section 1: CPA Locker Link Settings */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0d1522] border border-[#1b263b] shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#ffffff] flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#10b981]" />
                OgAds / CPA Content Locker Link
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                Every &quot;Download APK&quot; button across your entire website connects directly to this locker URL.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveLocker} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
                CPA Offer Locker URL (From OgAds, CPAGrip, or Adscend):
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="url"
                  required
                  value={inputLockerUrl}
                  onChange={(e) => setInputLockerUrl(e.target.value)}
                  placeholder="https://locked4.com/cl/i/your_ogads_id"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141e30] border border-[#27374e] text-xs sm:text-sm text-[#ffffff] placeholder-[#64748b] focus:outline-none focus:border-[#10b981]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051c14] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Locker URL</span>
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-lg bg-[#064e3b]/40 border border-[#10b981]/50 text-xs text-[#34d399] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#10b981]" />
                <span>
                  Locker link successfully saved! It will now be used by all download buttons on this site.
                </span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#121c2c] border border-[#1f2e45] text-xs text-[#94a3b8] space-y-1">
              <span className="font-bold text-[#ffffff]">Quick Example:</span>
              <p className="font-mono text-[#38bdf8] break-all">
                https://locked4.com/cl/i/abc123xyz
              </p>
              <p className="text-[11px] text-[#64748b]">
                In your OgAds dashboard: go to <strong>Content Lockers</strong> &rarr; select your locker &rarr; copy the <strong>Direct Link</strong> and paste it above.
              </p>
            </div>
          </form>
        </section>

        {/* Section 2: Manage Game Catalog */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0d1522] border border-[#1b263b] shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#ffffff] flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[#10b981]" />
                Games Catalog Manager
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Add, edit, or remove games displayed on your homepage.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setEditingGame({
                    title: '',
                    category: 'Action',
                    version: 'v1.0.0',
                    fileSize: '95 MB',
                    developer: 'Top Studio',
                    iconUrl: '',
                    isHot: true,
                  });
                  setIsAddingNew(true);
                }}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051c14] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Game</span>
              </button>

              <button
                onClick={handleDownloadJson}
                title="Download games.json to replace data/games.json"
                className="px-3 py-2 rounded-xl bg-[#141e30] border border-[#27374e] hover:border-[#10b981] text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span className="hidden sm:inline">Export games.json</span>
              </button>

              <button
                onClick={handleCopyJson}
                title="Copy all games JSON to clipboard"
                className="px-3 py-2 rounded-xl bg-[#141e30] border border-[#27374e] hover:border-[#10b981] text-xs font-semibold text-[#cbd5e1] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSuccess ? (
                  <Check className="w-3.5 h-3.5 text-[#10b981]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#f59e0b]" />
                )}
                <span className="hidden sm:inline">
                  {copiedSuccess ? 'Copied!' : 'Copy JSON'}
                </span>
              </button>
            </div>
          </div>

          {/* Search bar inside admin */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search existing games in dashboard..."
              className="w-full sm:max-w-xs px-3 py-2 rounded-lg bg-[#141e30] border border-[#23354d] text-xs text-[#ffffff] placeholder-[#64748b] focus:outline-none focus:border-[#10b981]"
            />
          </div>

          {/* Games Table/List */}
          <div className="overflow-x-auto rounded-xl border border-[#1f2e45]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121c2c] text-[#94a3b8] font-bold uppercase tracking-wider border-b border-[#1f2e45]">
                <tr>
                  <th className="p-3">Game</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Tags</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b273b]">
                {filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-[#131d2e] transition-colors">
                    <td className="p-3 flex items-center gap-3 min-w-[200px]">
                      <img
                        src={game.iconUrl}
                        alt={game.title}
                        className="w-9 h-9 rounded-lg object-cover bg-[#090e17] border border-[#23354d] shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&h=100&q=80';
                        }}
                      />
                      <div>
                        <div className="font-bold text-[#ffffff]">{game.title}</div>
                        <div className="text-[10px] text-[#64748b]">{game.developer}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#1f2e45] text-[#f97316] font-semibold text-[11px]">
                        {game.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#cbd5e1]">{game.version}</td>
                    <td className="p-3 font-mono text-[#94a3b8]">{game.fileSize}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {game.isHot && (
                          <span className="px-1.5 py-0.5 rounded bg-[#3b1219] text-[#ef4444] text-[10px] font-bold">
                            HOT
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-[#0b291d] text-[#10b981] text-[10px] font-bold">
                          FREE
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingGame(game);
                            setIsAddingNew(false);
                          }}
                          className="p-1.5 rounded-lg bg-[#141e30] hover:bg-[#1e2d45] text-[#38bdf8] transition-colors cursor-pointer"
                          title="Edit Game"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="p-1.5 rounded-lg bg-[#141e30] hover:bg-[#3d161d] text-[#ef4444] transition-colors cursor-pointer"
                          title="Delete Game"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal for Add / Edit Game */}
        {editingGame && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl bg-[#0d1522] border border-[#27374e] p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2e45] pb-3">
                <h3 className="text-base font-bold text-[#ffffff]">
                  {isAddingNew ? 'Add New Game to Catalog' : `Edit: ${editingGame.title}`}
                </h3>
                <button
                  onClick={() => setEditingGame(null)}
                  className="text-[#94a3b8] hover:text-[#ffffff] text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveGame} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#cbd5e1] mb-1">Game Title:</label>
                  <input
                    type="text"
                    required
                    value={editingGame.title || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                    placeholder="e.g. Monopoly GO! Mod APK"
                    className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#cbd5e1] mb-1">Category:</label>
                    <select
                      value={editingGame.category || 'Action'}
                      onChange={(e) => setEditingGame({ ...editingGame, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                    >
                      {['Action', 'Board', 'Casual', 'Racing', 'RPG', 'Simulation', 'Sports', 'Strategy'].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#cbd5e1] mb-1">Version:</label>
                    <input
                      type="text"
                      value={editingGame.version || 'v1.0.0'}
                      onChange={(e) => setEditingGame({ ...editingGame, version: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#cbd5e1] mb-1">File Size:</label>
                    <input
                      type="text"
                      value={editingGame.fileSize || '120 MB'}
                      onChange={(e) => setEditingGame({ ...editingGame, fileSize: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#cbd5e1] mb-1">Developer:</label>
                    <input
                      type="text"
                      value={editingGame.developer || 'Supercell'}
                      onChange={(e) => setEditingGame({ ...editingGame, developer: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#cbd5e1] mb-1">Image / Icon URL:</label>
                  <input
                    type="url"
                    value={editingGame.iconUrl || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, iconUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or Google Play icon URL"
                    className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isHotCheckbox"
                    checked={!!editingGame.isHot}
                    onChange={(e) => setEditingGame({ ...editingGame, isHot: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#10b981]"
                  />
                  <label htmlFor="isHotCheckbox" className="text-xs font-semibold text-[#cbd5e1] cursor-pointer">
                    Show &quot;HOT&quot; tag on card
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1f2e45]">
                  <button
                    type="button"
                    onClick={() => setEditingGame(null)}
                    className="px-4 py-2 rounded-lg bg-[#141e30] text-[#94a3b8] hover:text-[#ffffff] font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#051c14] font-bold transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Section 3: Step-by-Step Deployment & Backend Explanation */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0d1522] border border-[#1b263b] shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#ffffff] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#38bdf8]" />
              Step-by-Step Guide: Deployment & Backend Management
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Follow these simple, easy steps to launch your site on Netlify with your custom domain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#cbd5e1] leading-relaxed">
            {/* Guide Part 1: Netlify Deployment */}
            <div className="p-4 rounded-xl bg-[#121c2c] border border-[#1f2e45] space-y-3">
              <h3 className="text-sm font-bold text-[#10b981] flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Part 1: How to Put Website Online with Netlify
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-[#94a3b8]">
                <li>
                  <strong className="text-[#ffffff]">Export your project:</strong> Click the Settings menu in AI Studio and select <strong>&quot;Export to GitHub&quot;</strong> or <strong>&quot;Download ZIP&quot;</strong>.
                </li>
                <li>
                  <strong className="text-[#ffffff]">Sign in to Netlify:</strong> Go to{' '}
                  <a
                    href="https://app.netlify.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#38bdf8] underline"
                  >
                    app.netlify.com
                  </a>{' '}
                  and click <strong>&quot;Add new site&quot; &rarr; &quot;Import an existing project&quot;</strong>.
                </li>
                <li>
                  <strong className="text-[#ffffff]">Select your GitHub repo:</strong> Choose the repository you just exported.
                </li>
                <li>
                  <strong className="text-[#ffffff]">Build Settings (pre-configured):</strong>
                  <div className="mt-1 p-2 rounded bg-[#090e17] font-mono text-[11px] text-[#34d399] space-y-0.5">
                    <div>Build Command: npm run build</div>
                    <div>Publish Directory: .next</div>
                  </div>
                </li>
                <li>
                  <strong className="text-[#ffffff]">Click &quot;Deploy Site&quot;:</strong> Netlify will build and provide an instant live HTTPS link!
                </li>
              </ol>
            </div>

            {/* Guide Part 2: Custom Domain */}
            <div className="p-4 rounded-xl bg-[#121c2c] border border-[#1f2e45] space-y-3">
              <h3 className="text-sm font-bold text-[#38bdf8] flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> Part 2: Connect Your Custom Domain
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-[#94a3b8]">
                <li>
                  <strong className="text-[#ffffff]">Open Domain Settings:</strong> In Netlify, go to <strong>Site configuration &rarr; Domain management &rarr; Add custom domain</strong>.
                </li>
                <li>
                  <strong className="text-[#ffffff]">Enter your domain:</strong> Type your domain (e.g. <code className="text-[#ffffff]">mobilegames4u.space</code>) and click &quot;Verify&quot;.
                </li>
                <li>
                  <strong className="text-[#ffffff]">Update DNS records at your registrar:</strong> (Namecheap, GoDaddy, Cloudflare, etc.):
                  <div className="mt-1.5 p-2 rounded bg-[#090e17] font-mono text-[11px] text-[#cbd5e1] space-y-1">
                    <div><strong>Type: A</strong> | Name: @ | Value: 75.2.60.5</div>
                    <div><strong>Type: CNAME</strong> | Name: www | Value: your-site.netlify.app</div>
                  </div>
                </li>
                <li>
                  <strong className="text-[#ffffff]">Free SSL Activation:</strong> Netlify will automatically generate a free Let&apos;s Encrypt SSL certificate for your domain within a few minutes!
                </li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
