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
  Star,
  HardDrive
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

  const handleDownloadClick = () => {
    setIsPreparing(true);
    setProgress(30);

    const targetLockerUrl = (game.contentLockerLink && game.contentLockerLink.trim().length > 0)
      ? game.contentLockerLink.trim()
      : getLockerUrl(game.id);

    setTimeout(() => {
      setProgress(75);
    }, 350);

    setTimeout(() => {
      setProgress(100);
      window.location.href = targetLockerUrl;
    }, 800);
  };

  return (
    <div 
      id="download-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="download-modal-card"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#2a3a52] bg-[#162234] shadow-2xl shadow-black/90 flex flex-col"
      >
        {/* Top Header Bar with title, category & Close Button (with dedicated padding so nothing gets covered) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f1725] border-b border-[#23334a]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              FREE
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#1e2d42] text-[#f97316] border border-[#2e415e] truncate">
              {game.category}
            </span>
            {game.isHot && (
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30">
                HOT
              </span>
            )}
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#ffffff] bg-[#162234] hover:bg-[#202f45] border border-[#2a3c56] transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Game Thumbnail, Title, Size & Rating */}
          <div className="flex items-start gap-4">
            <img
              src={game.iconUrl}
              alt={`${game.title} icon`}
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-[#2b3d59] bg-[#0c131f] shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200&q=80';
              }}
            />
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-base sm:text-lg font-black text-[#ffffff] leading-snug">
                {game.title}
              </h3>
              
              <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                <span className="flex items-center gap-1 text-[#38bdf8] font-mono font-bold">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>{game.fileSize}</span>
                </span>
                <span className="text-[#334155]">•</span>
                <span className="flex items-center gap-1 text-[#fbbf24] font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#fbbf24]" />
                  <span>{game.rating}</span>
                </span>
                <span className="text-[#334155]">•</span>
                <span className="text-[#cbd5e1] font-semibold">{game.downloadsCount}</span>
              </div>

              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] text-[#10b981] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Clean &amp; Verified Safe Package</span>
                </span>
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div className="p-2.5 rounded-xl bg-[#0f1725] border border-[#23334a] flex items-center justify-between text-xs">
            <span className="text-[#94a3b8] flex items-center gap-1.5 font-medium text-[11px]">
              <Smartphone className="w-3.5 h-3.5 text-[#38bdf8]" /> Target Platform:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#1a293e] text-[#38bdf8] border border-[#2a4060]">
                Android (.apk)
              </span>
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#1a293e] text-[#cbd5e1] border border-[#2a4060]">
                iOS (.ipa)
              </span>
            </div>
          </div>

          {/* Mod Features Included */}
          <div className="p-3 rounded-xl bg-[#0f1725] border border-[#23334a] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="uppercase tracking-wider text-[#38bdf8]">
                Mod Features Included:
              </span>
              <span className="text-[#10b981] flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3 stroke-[2.5]" /> 100% Tested
              </span>
            </div>
            <div className="space-y-1.5">
              {game.modFeatures.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#e2e8f0]">
                  <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0 stroke-[2.5]" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicator when clicked */}
          {isPreparing && (
            <div className="space-y-1.5 p-3 rounded-xl bg-[#0f1725] border border-[#10b981]/50 animate-in fade-in">
              <div className="flex justify-between text-xs text-[#10b981] font-bold">
                <span>Preparing package download...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[#1a2638] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#10b981] h-full transition-all duration-300 rounded-full shadow-sm shadow-[#10b981]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download Button */}
          <div>
            <button
              id="btn-trigger-ogads-download"
              onClick={handleDownloadClick}
              disabled={isPreparing}
              className="w-full py-3.5 px-4 rounded-xl bg-[#d90429] hover:bg-[#b50322] active:scale-[0.98] text-[#ffffff] font-black text-base transition-all shadow-xl shadow-[#d90429]/30 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 uppercase tracking-wider"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>
                {isPreparing 
                  ? 'PREPARING DOWNLOAD...' 
                  : `DOWNLOAD APK (${game.fileSize})`}
              </span>
            </button>
          </div>

          {/* Footer security badges */}
          <div className="pt-2 border-t border-[#23334a] flex items-center justify-between text-[11px] text-[#94a3b8]">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#10b981] font-medium">
              <Zap className="w-3.5 h-3.5 text-[#10b981]" />
              <span>No Root / Jailbreak Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
