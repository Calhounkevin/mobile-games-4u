'use client';

import React from 'react';

interface WebsiteLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function WebsiteLogo({ className = '', showText = true, size = 'md' }: WebsiteLogoProps) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Simple and Clean Vector M Emblem */}
      <div className={`relative shrink-0 ${iconDimensions} rounded-xl overflow-hidden transition-transform duration-200 group-hover:scale-105`}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Flat Solid Background Badge */}
          <rect x="2.5" y="2.5" width="59" height="59" rx="14" fill="#0d1522" stroke="#10b981" strokeWidth="2.5" />
          
          {/* Simple Clean Vector M */}
          <path
            d="M16 46V18L32 34L48 18V46"
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Flat Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1 font-black tracking-tight text-base sm:text-lg">
            <span className="text-[#ffffff] font-extrabold tracking-tight">MOBILEGAMES</span>
            <span className="text-[#10b981] font-black">4U</span>
          </div>
          <span className="text-[10px] text-[#94a3b8] font-semibold tracking-wider uppercase">
            Verified Mod Vault
          </span>
        </div>
      )}
    </div>
  );
}
