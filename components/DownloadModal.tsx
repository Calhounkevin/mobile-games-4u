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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="download-modal-card"
        className="relative w-full max-w-2xl sm:max-w-3xl overflow-hidden rounded-2xl border border-[#2a3a52] bg-[#1a2638] shadow-2xl shadow-black/90"
      >
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-lg text-[#94a3b8] hover:text-[#ffffff] bg-[#111a28] hover:bg-[#202f45] border border-[#27374e] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4 sm:p-6 max-h-[92vh] overflow-y-auto">
          {/* 2-Column Responsive Layout on Tablets/Desktop: Everything above the fold */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-start">
            
            {/* Left Column: Game Info & Platform (5 of 12 cols on desktop) */}
            <div className="sm:col-span-5 space-y-3.5">
              <div className="flex items-start gap-3.5">
                <img
                  src={game.iconUrl}
                  alt={`${game.title} icon`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#2b3d59] bg-[#111a28] shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200&q=80';
                  }}
                />
                <div className="min-w-0 pr-6 sm:pr-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    {game.isHot && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#111a28] text-[#ef4444] border border-[#27374e]">
                        HOT
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#111a28] text-[#10b981] border border-[#27374e]">
                      FREE
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#111a28] text-[#f97316] border border-[#27374e]">
                      {game.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#ffffff] leading-tight line-clamp-2">
                    {game.title}
                  </h3>
                  <p className="text-xs text-[#94a3b8] truncate mt-0.5">
                    Package Size: <span className="text-[#38bdf8] font-mono font-bold">{game.fileSize}</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-[#fbbf24] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#fbbf24]" />
                    <span>{game.rating}</span>
                    <span className="text-[#94a3b8] font-normal text-[11px]">({game.downloadsCount})</span>
                  </div>
                </div>
              </div>

              {/* Compatibility & Clean Badge */}
              <div className="p-3 rounded-xl bg-[#111a28] border border-[#27374e] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#cbd5e1] flex items-center gap-1.5 font-semibold text-[11px]">
                    <Smartphone className="w-3.5 h-3.5 text-[#38bdf8]" /> Universal Support:
                  </span>
                  <span className="text-[11px] text-[#10b981] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Verified Safe
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-1 px-2.5 py-1 rounded-lg font-bold text-[11px] bg-[#1a2638] text-[#ffffff] border border-[#2a3a52] flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    Android (.apk)
                  </span>
                  <span className="flex-1 px-2.5 py-1 rounded-lg font-bold text-[11px] bg-[#1a2638] text-[#ffffff] border border-[#2a3a52] flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    iOS (.ipa)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Features & Prominent Download Action (7 of 12 cols on desktop) */}
            <div className="sm:col-span-7 flex flex-col justify-between space-y-3 sm:border-l sm:border-[#27374e] sm:pl-6">
              {/* Mod Features */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#ffffff]">
                  <span className="uppercase tracking-wider text-[#38bdf8] text-[11px]">
                    Mod Features Included:
                  </span>
                  <span className="text-[#10b981] flex items-center gap-1 font-semibold text-[11px]">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 100% Tested
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#111a28] border border-[#27374e] space-y-2">
                  {game.modFeatures.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#e2e8f0]">
                      <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0 stroke-[2.5]" />
                      <span className="font-medium text-xs truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicator if clicked */}
              {isPreparing && (
                <div className="space-y-1.5 p-3 rounded-xl bg-[#111a28] border border-[#10b981]/50 animate-in fade-in">
                  <div className="flex justify-between text-xs text-[#10b981] font-bold">
                    <span>Preparing direct mirror...</span>
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

              {/* Prominent High-Visibility Download Button - Directly Visible Without Scrolling */}
              <div className="space-y-2 pt-1">
                <button
                  id="btn-trigger-ogads-download"
                  onClick={handleDownloadClick}
                  disabled={isPreparing}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#d90429] hover:bg-[#b50322] active:scale-[0.98] text-[#ffffff] font-black text-base sm:text-lg transition-all shadow-xl shadow-[#d90429]/30 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 uppercase tracking-wide"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>
                    {isPreparing 
                      ? 'PREPARING DOWNLOAD...' 
                      : `DOWNLOAD APK (${game.fileSize})`}
                  </span>
                </button>
              </div>

              {/* Footnote security tags */}
              <div className="pt-2 border-t border-[#27374e] flex items-center justify-between text-[11px] text-[#94a3b8]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#10b981] font-medium">
                  <Zap className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>No Root / No Jailbreak</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
