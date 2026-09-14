'use client';

import React from 'react';
import { GameItem } from '@/lib/games-data';
import { Download, ShieldCheck, Star, Check, HardDrive, Tag } from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  onSelectGame: (game: GameItem) => void;
}

export function GameCard({ game, onSelectGame }: GameCardProps) {
  // Normalize version
  const displayVersion = game.version.startsWith('v') ? game.version : `v${game.version}`;

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
      className="group relative flex flex-col justify-between rounded-2xl border border-[#26374f] bg-[#152132] p-4 cursor-pointer select-none text-left transition-all duration-200 hover:border-[#38bdf8]/60 hover:bg-[#1b2b40] hover:shadow-2xl hover:shadow-black/70"
    >
      <div>
        {/* Top Badges Row: Clear Category, Size Pill, and Hot/Clean status */}
        <div className="flex items-center justify-between gap-1.5 mb-3.5 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {game.isHot && (
              <span className="px-2 py-0.5 rounded-md bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] uppercase tracking-wide shrink-0">
                HOT
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-[#1e2e44] border border-[#2b3e5a] text-[#f97316] uppercase tracking-wide truncate shrink-0">
              {game.category}
            </span>
            {/* Prominent Size Tag in the top badge cluster */}
            <span className="px-2 py-0.5 rounded-md bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#38bdf8] font-mono shrink-0 flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              <span>{game.fileSize}</span>
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clean</span>
          </span>
        </div>

        {/* Game Icon & Title Area */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="shrink-0 relative">
            <img
              src={game.iconUrl}
              alt={`${game.title} Mod APK icon`}
              className="w-20 h-20 rounded-xl object-cover border border-[#2a3c56] bg-[#0d1522] group-hover:border-[#38bdf8]/50 transition-colors"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&h=200&q=80';
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-[#ffffff] leading-snug line-clamp-2 group-hover:text-[#38bdf8] transition-colors mb-1.5">
              {game.title}
            </h3>

            {/* Rating & Downloads Stats */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#94a3b8]">
              <span className="flex items-center gap-1 text-[#fbbf24] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#fbbf24]" />
                <span>{game.rating}</span>
              </span>
              <span className="text-[#334155]">•</span>
              <span className="flex items-center gap-1 text-[#cbd5e1]">
                <Download className="w-3 h-3 text-[#38bdf8]" />
                <span>{game.downloadsCount}</span>
              </span>
              <span className="text-[#334155]">•</span>
              <span className="text-[#10b981] font-bold">Free</span>
            </div>
          </div>
        </div>

        {/* Mod Features Included Box */}
        <div className="mb-3.5 p-2.5 rounded-xl bg-[#0f1725] border border-[#23334a] text-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#38bdf8] mb-1.5 flex items-center gap-1">
            <span>Mod Features:</span>
          </div>
          <div className="space-y-1">
            {game.modFeatures.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[#cbd5e1] text-xs">
                <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0 stroke-[2.5]" />
                <span className="truncate font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Version info + Get Mod APK Button */}
      <div className="space-y-2 pt-2 border-t border-[#23334a]">
        <div className="flex items-center justify-between text-xs text-[#94a3b8] px-0.5">
          <span className="flex items-center gap-1 font-mono text-[11px] text-[#cbd5e1]">
            <Tag className="w-3 h-3 text-[#38bdf8]" />
            <span>{displayVersion}</span>
          </span>
          <span className="text-[11px] font-semibold text-[#10b981]">
            Direct Download
          </span>
        </div>

        <div
          id={`btn-download-${game.id}`}
          className="h-11 w-full rounded-xl bg-[#d90429] hover:bg-[#b50322] active:scale-[0.98] text-[#ffffff] font-black text-xs sm:text-sm transition-all shadow-md shadow-[#d90429]/25 flex items-center justify-center gap-2 uppercase tracking-wider group-hover:scale-[1.01]"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>GET MOD APK</span>
        </div>
      </div>
    </div>
  );
}
