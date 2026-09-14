'use client';

import React, { useState, useEffect } from 'react';
import { GameItem } from '@/lib/games-data';
import { getLockerUrl } from '@/lib/config';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Smartphone, 
  Check, 
  Lock, 
  Zap,
  Star
} from 'lucide-react';

interface DownloadModalProps {
  game: GameItem | null;
  onClose: () => void;
}

export function DownloadModal({ game, onClose }: DownloadModalProps) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (game) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [game]);

  if (!game) return null;

  const displayVersion = game.version.startsWith('v') ? game.version : `v${game.version}`;

  const handleDownloadClick = () => {
    setIsPreparing(true);
    setProgress(30);

    const targetLockerUrl = (game.contentLockerLink && game.contentLockerLink.trim().length > 0)
      ? game.contentLockerLink.trim()
      : getLockerUrl(game.id);

    // Fast feedback animation, then redirect directly in the same page
    setTimeout(() => {
      setProgress(75);
    }, 350);

    setTimeout(() => {
      setProgress(100);
      // Open the locker site in the SAME page (not in a new tab)
      window.location.href = targetLockerUrl;
    }, 850);
  };

  return (
    <div 
      id="download-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="download-modal-card"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#2a3a52] bg-[#1a2638] shadow-2xl shadow-black/90"
      >
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-lg text-[#94a3b8] hover:text-[#ffffff] bg-[#111a28] hover:bg-[#202f45] border border-[#27374e] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
          {/* Game Header with large visible logo (no shadow) */}
          <div className="flex items-start gap-4 pr-6">
            <img
              src={game.iconUrl}
              alt={`${game.title} icon`}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#2b3d59] bg-[#111a28] shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200&q=80';
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                {game.isHot && (
                  <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded bg-[#111a28] text-[#ef4444] border border-[#27374e]">
                    HOT
                  </span>
                )}
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded bg-[#111a28] text-[#10b981] border border-[#27374e]">
                  FREE
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded bg-[#111a28] text-[#f97316] border border-[#27374e]">
                  {game.category}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded bg-[#111a28] text-[#10b981] border border-[#27374e] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Clean
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#ffffff] leading-snug">
                {game.title} Mod APK
              </h3>
              <p className="text-xs text-[#94a3b8] truncate mt-0.5">
                {game.developer} • <span className="text-[#cbd5e1] font-mono">{game.fileSize}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#fbbf24] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#fbbf24]" />
                <span>{game.rating} / 5.0</span>
                <span className="text-[#94a3b8] font-normal">({game.downloadsCount} downloads)</span>
              </div>
            </div>
          </div>

          {/* Supported OS Tags */}
          <div className="p-3.5 rounded-xl bg-[#111a28] border border-[#27374e] text-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[#e2e8f0] flex items-center gap-1.5 font-medium">
                <Smartphone className="w-4 h-4 text-[#38bdf8]" /> Supported Platforms:
              </span>
              <span className="text-[11px] text-[#10b981] font-semibold">Universal Compatibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg font-bold text-xs bg-[#1a2638] text-[#ffffff] border border-[#2a3a52] inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                Android (.apk)
              </span>
              <span className="px-3 py-1.5 rounded-lg font-bold text-xs bg-[#1a2638] text-[#ffffff] border border-[#2a3a52] inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                iOS (.ipa)
              </span>
            </div>
          </div>

          {/* Included Mod Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#ffffff]">
              <span className="uppercase tracking-wide text-[#38bdf8]">Mod Unlocks Included:</span>
              <span className="text-[#10b981] flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 100% Tested & Working
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111a28] border border-[#27374e] space-y-2.5">
              {game.modFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[#e2e8f0]">
                  <Check className="w-4 h-4 text-[#10b981] shrink-0 stroke-[2.5]" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparing progress bar indicator */}
          {isPreparing && (
            <div className="space-y-2 p-3.5 rounded-xl bg-[#111a28] border border-[#10b981]/50">
              <div className="flex justify-between text-xs text-[#10b981] font-bold">
                <span>Connecting to download mirror...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#1a2638] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#10b981] h-full transition-all duration-300 rounded-full shadow-sm shadow-[#10b981]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Download CTA (#d90429) */}
          <div className="space-y-3 pt-1">
            <button
              id="btn-trigger-ogads-download"
              onClick={handleDownloadClick}
              disabled={isPreparing}
              className="w-full py-4 px-5 rounded-xl bg-[#d90429] hover:bg-[#b50322] text-[#ffffff] font-black text-base sm:text-lg transition-all shadow-xl shadow-[#d90429]/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 uppercase tracking-wide"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isPreparing 
                  ? 'PREPARING DOWNLOAD...' 
                  : `DOWNLOAD APK (${game.fileSize})`}
              </span>
            </button>
          </div>

          {/* Security footnote tags */}
          <div className="pt-2 border-t border-[#27374e] flex items-center justify-between text-[11px] text-[#94a3b8]">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>256-Bit Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#10b981] font-medium">
              <Zap className="w-3.5 h-3.5 text-[#10b981]" />
              <span>No Root / Jailbreak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
