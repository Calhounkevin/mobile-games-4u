'use client';

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { GAMES_DATA } from '@/lib/games-data';

export function RecentDownloadsTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % GAMES_DATA.length);
        setVisible(true);
      }, 350);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const game = GAMES_DATA[index % GAMES_DATA.length];

  return (
    <div
      id="bottom-live-notification"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-sm"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#1a2638] border border-[#2a3a52] text-[#e2e8f0] text-xs transition-opacity duration-300 shadow-2xl shadow-black/80 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-[#111a28] border border-[#27374e] flex items-center justify-center shrink-0 text-[#10b981]">
          <Download className="w-4 h-4 stroke-[2.5]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs">
            <strong className="text-[#ffffff] font-bold">{game.title} Mod APK</strong>
          </p>
          <p className="text-[11px] text-[#94a3b8] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block shrink-0" />
            <span>downloaded just now</span>
          </p>
        </div>

        <div className="shrink-0 text-[10px] uppercase font-bold text-[#10b981] px-2 py-0.5 rounded-md bg-[#10b981]/10 border border-[#10b981]/30">
          LIVE
        </div>
      </div>
    </div>
  );
}
