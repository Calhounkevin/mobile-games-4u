'use client';

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface LiveOnlineBadgeProps {
  className?: string;
}

export function LiveOnlineBadge({ className = '' }: LiveOnlineBadgeProps) {
  // Start at a realistic active number well below 1000
  const [onlineCount, setOnlineCount] = useState<number>(538);

  useEffect(() => {
    // Generate organic, realistic changes every 3.8 to 5.2 seconds
    const updateCount = () => {
      setOnlineCount((prev) => {
        // Delta between -5 and +6
        const delta = Math.floor(Math.random() * 12) - 5;
        let next = prev + (delta === 0 ? 1 : delta);

        // Strict boundary: Never reach 1,000+ (kept strictly between 410 and 870)
        if (next >= 880) {
          next = 835 - Math.floor(Math.random() * 25);
        } else if (next <= 410) {
          next = 455 + Math.floor(Math.random() * 25);
        }

        return next;
      });
    };

    const interval = setInterval(updateCount, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-[#0b1320] border border-[#1e2d42] hover:border-[#10b981]/50 shadow-sm transition-all duration-200 select-none ${className}`}
      title="Live users currently browsing and downloading"
    >
      {/* Live Pulsing Beacon */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider text-[#10b981]">
          LIVE
        </span>
      </div>

      <span className="h-3 w-px bg-[#1e2d42]" />

      {/* Online Count */}
      <div className="flex items-center gap-1.5 text-xs">
        <Users className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
        <span className="font-mono font-bold text-xs sm:text-sm text-[#ffffff] tracking-tight tabular-nums">
          {onlineCount.toLocaleString()}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
          ONLINE
        </span>
      </div>
    </div>
  );
}
