'use client';

import React from 'react';
import { GameItem } from '@/lib/games-data';
import { Download, ShieldCheck, Star, Check, HardDrive, Tag, CheckCircle2 } from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  onSelectGame: (game: GameItem) => void;
}

export function GameCard({ game, onSelectGame }: GameCardProps) {
  // Normalize version so it never renders as 'vv1.26.0'
  const displayVersion = game.version.startsWith('v') ? game.version : `v${game.version}`;

  // Shared base container style for tags above the game image
  const baseTagClass = "px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded bg-[#111a28] border border-[#27374e] flex items-center gap-1 shrink-0";

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onSelectGame(game)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectGame(game);
        }
      }}
      role="button"
      tabIndex={0}
      className="group h-full flex flex-col justify-between rounded-xl border border-[#2a3a52] bg-[#1a2638] p-4 sm:p-5 cursor-pointer select-none text-left transition-all duration-200 hover:border-[#38bdf8]/50 hover:bg-[#202f45] hover:shadow-xl hover:shadow-black/50"
    >
      {/* Top Content Area */}
      <div className="flex flex-col">
        {/* Top tags: same container, text colors as requested */}
        <div className="h-6 flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {game.isHot && (
              <span className={`${baseTagClass} text-[#ef4444]`}>
                HOT
              </span>
            )}
            <span className={`${baseTagClass} text-[#10b981]`}>
              FREE
            </span>
            <span className={`${baseTagClass} text-[#f97316] truncate`}>
              {game.category}
            </span>
          </div>
          <span className={`${baseTagClass} text-[#10b981]`}>
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" /> Clean
          </span>
        </div>

        {/* Game Info: Large visible thumbnail without shadow & high legibility typography */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="shrink-0 relative">
            <img
              src={game.iconUrl}
              alt={`${game.title} Mod APK icon`}
              className="w-24 h-24 sm:w-26 sm:h-26 rounded-2xl object-cover border-2 border-[#2b3d59] bg-[#111a28] group-hover:border-[#38bdf8]/50 transition-colors"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200&q=80';
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            {/* Title container: 46px (2 lines max) for uniform vertical spacing */}
            <div className="h-[46px] flex items-center mb-1">
              <h3 className="text-base sm:text-lg font-black text-[#ffffff] leading-snug line-clamp-2 group-hover:text-[#38bdf8] transition-colors">
                {game.title}
              </h3>
            </div>
            
            {/* Rating, Downloads, Size: Same size, same style, more visible with icons */}
            <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-bold text-[#ffffff] truncate">
              <span className="flex items-center gap-1 text-[#ffffff] shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#fbbf24] text-[#fbbf24] shrink-0" />
                <span>{game.rating}</span>
              </span>
              <span className="text-[#475569] font-normal">•</span>
              <span className="flex items-center gap-1 text-[#ffffff] truncate shrink-0">
                <Download className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <span>{game.downloadsCount}</span>
              </span>
              <span className="text-[#475569] font-normal">•</span>
              <span className="flex items-center gap-1 text-[#ffffff] font-mono text-xs sm:text-[13px] shrink-0">
                <HardDrive className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                <span>{game.fileSize}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mod key highlights: High contrast, pleasant to read */}
        <div className="h-[88px] mb-4 p-3 rounded-lg bg-[#111a28] border border-[#27374e] text-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wide flex items-center gap-1">
            <span>Mod Features Included:</span>
          </div>
          <ul className="space-y-1 text-[#e2e8f0] text-xs">
            {game.modFeatures.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0 stroke-[2.5]" />
                <span className="truncate font-medium">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action / Download CTA: Version & Ready to install (same size, same style, more visible) */}
      <div className="pt-3 border-t border-[#27374e]">
        <div className="h-6 flex items-center justify-between text-xs sm:text-[13px] font-bold mb-2.5">
          <span className="flex items-center gap-1.5 text-[#ffffff]">
            <Tag className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
            <span>{displayVersion}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#10b981]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
            <span>Ready to Install</span>
          </span>
        </div>

        {/* Download Button using #d90429 */}
        <div
          id={`btn-download-${game.id}`}
          className="h-12 w-full rounded-lg bg-[#d90429] hover:bg-[#b50322] text-[#ffffff] font-black text-sm transition-all shadow-md shadow-[#d90429]/25 flex items-center justify-center gap-2 uppercase tracking-wider group-hover:scale-[1.01]"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>GET MOD APK</span>
        </div>
      </div>
    </div>
  );
}
