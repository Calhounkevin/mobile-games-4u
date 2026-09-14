'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { WebsiteLogo } from '@/components/WebsiteLogo';
import { SITE_CONFIG } from '@/lib/config';
import { GameItem } from '@/lib/games-data';
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
  Globe,
  Settings,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

import { useActiveGames, useActiveLockerUrl, saveLockerUrl, saveCustomGames } from '@/lib/storage-store';

export default function AdminDashboardPage() {
  const activeLocker = useActiveLockerUrl();
  const activeGames = useActiveGames();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Change Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePwError, setChangePwError] = useState('');
  const [changePwSuccess, setChangePwSuccess] = useState(false);

  // Dashboard Form State
  const [inputLockerUrl, setInputLockerUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGame, setEditingGame] = useState<Partial<GameItem> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Check existing session auth on client load
  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const isAuth = sessionStorage.getItem('mobilegames4u_admin_auth');
        if (isAuth === 'true') {
          setIsAuthenticated(true);
        }
      }
      setIsAuthChecking(false);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Sync input field once activeLocker loads or changes, but only if user hasn't typed
  useEffect(() => {
    if (activeLocker) {
      const t = setTimeout(() => {
        setInputLockerUrl((prev) => (prev ? prev : activeLocker));
      }, 0);
      return () => clearTimeout(t);
    }
  }, [activeLocker]);

  // Master password helper
  const getMasterPassword = () => {
    if (typeof window === 'undefined') return 'admin1234';
    return localStorage.getItem('mobilegames4u_admin_pw') || 'admin1234';
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getMasterPassword();
    if (passwordInput.trim() === correctPassword.trim()) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mobilegames4u_admin_auth', 'true');
      }
      setIsAuthenticated(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Incorrect password. Please verify and try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mobilegames4u_admin_auth');
    }
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Handle Changing Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwError('');
    if (newPassword.trim().length < 4) {
      setChangePwError('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePwError('Passwords do not match. Please re-type.');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobilegames4u_admin_pw', newPassword.trim());
    }
    setChangePwSuccess(true);
    setTimeout(() => {
      setChangePwSuccess(false);
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    }, 1800);
  };

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

  // Loading state while checking auth
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0a0f18] flex items-center justify-center text-[#94a3b8]">
        <div className="text-xs font-mono">Verifying credentials...</div>
      </div>
    );
  }

  // LOCKED SCREEN: If not authenticated, render the Password Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0f18] text-[#e2e8f0] flex flex-col items-center justify-center p-4 selection:bg-[#10b981]/30">
        <div className="w-full max-w-md rounded-2xl bg-[#0d1522] border border-[#1b263b] shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center justify-center mx-auto shadow-lg shadow-[#10b981]/10">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-[#ffffff] tracking-tight">Admin Authentication</h1>
            <p className="text-xs text-[#94a3b8]">
              This dashboard is protected. Enter your master password to access website controls.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">
                Master Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#141e30] border border-[#27374e] text-sm text-[#ffffff] placeholder-[#64748b] focus:outline-none focus:border-[#10b981]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#ffffff] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-[#3b1219]/60 border border-[#ef4444]/50 text-xs text-[#fca5a5] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051c14] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#10b981]/20"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-[#1b263b] flex items-center justify-between text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[#94a3b8] hover:text-[#ffffff] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Homepage</span>
            </Link>
            <span className="text-[11px] text-[#64748b]">Default password: <code className="text-[#38bdf8]">admin1234</code></span>
          </div>
        </div>
      </div>
    );
  }

  // UNLOCKED SCREEN: Full Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0a0f18] text-[#e2e8f0] pb-20 selection:bg-[#10b981]/30 selection:text-[#10b981]">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#0d1422]/95 backdrop-blur-md border-b border-[#1b263b] px-4 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e30] border border-[#23354d] text-xs font-semibold text-[#cbd5e1] hover:text-[#ffffff] hover:border-[#10b981] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Site</span>
            </Link>
            <WebsiteLogo size="sm" showText={false} />
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#ffffff] tracking-tight">
                Website Control Center
              </h1>
              <p className="text-[11px] text-[#94a3b8] hidden sm:block">Protected Admin Panel</p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={inputLockerUrl || activeLocker}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-xs font-bold hover:bg-[#10b981]/25 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Locker</span>
            </a>

            {/* Change Password Modal Trigger */}
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setChangePwError('');
                setChangePwSuccess(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e30] border border-[#23354d] text-xs font-semibold text-[#cbd5e1] hover:text-[#ffffff] hover:border-[#38bdf8] transition-colors cursor-pointer"
              title="Change Master Admin Password"
            >
              <Key className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="hidden sm:inline">Change Password</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141e30] border border-[#23354d] text-xs font-semibold text-[#ef4444] hover:bg-[#3b1219] hover:border-[#ef4444] transition-colors cursor-pointer"
              title="Lock Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Exit</span>
            </button>
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
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#10b981]">Security Status</div>
              <div className="text-xs text-[#cbd5e1] mt-0.5">Password Protected Session</div>
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
                  Locker link successfully saved! It is now immediately active on all download buttons.
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
              placeholder="Search games in catalog..."
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

        {/* Modal for Change Password */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0d1522] border border-[#27374e] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2e45] pb-3">
                <h3 className="text-base font-bold text-[#ffffff] flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#38bdf8]" />
                  Change Master Password
                </h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-[#94a3b8] hover:text-[#ffffff] text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#cbd5e1] mb-1">New Password:</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 4 chars)..."
                    className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#cbd5e1] mb-1">Confirm New Password:</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password..."
                    className="w-full px-3 py-2 rounded-lg bg-[#141e30] border border-[#27374e] text-[#ffffff] focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                {changePwError && (
                  <div className="p-2.5 rounded-lg bg-[#3b1219] border border-[#ef4444]/40 text-[#fca5a5] text-[11px]">
                    {changePwError}
                  </div>
                )}

                {changePwSuccess && (
                  <div className="p-2.5 rounded-lg bg-[#064e3b] border border-[#10b981]/40 text-[#34d399] text-[11px]">
                    Password updated successfully!
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#141e30] text-[#94a3b8] hover:text-[#ffffff] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#051c14] font-bold cursor-pointer transition-colors"
                  >
                    Save New Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  className="text-[#94a3b8] hover:text-[#ffffff] text-sm font-bold cursor-pointer"
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
              Quick Deployment Reference
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              Your site settings for automated Netlify builds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#cbd5e1] leading-relaxed">
            <div className="p-4 rounded-xl bg-[#121c2c] border border-[#1f2e45] space-y-3">
              <h3 className="text-sm font-bold text-[#10b981] flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Netlify Build Settings
              </h3>
              <div className="p-2.5 rounded bg-[#090e17] font-mono text-[11px] text-[#34d399] space-y-1">
                <div>Build Command: npm run build</div>
                <div>Publish Directory: out</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121c2c] border border-[#1f2e45] space-y-3">
              <h3 className="text-sm font-bold text-[#38bdf8] flex items-center gap-1.5">
                <Settings className="w-4 h-4" /> DNS Records for Custom Domain
              </h3>
              <div className="p-2.5 rounded bg-[#090e17] font-mono text-[11px] text-[#cbd5e1] space-y-1">
                <div><strong>Type: A</strong> | Name: @ | Value: 75.2.60.5</div>
                <div><strong>Type: CNAME</strong> | Name: www | Value: your-site.netlify.app</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
