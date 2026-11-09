"use client";

import React from 'react';

export interface SecurityBadgeProps {
  isHttps?: boolean;
  network?: string;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  isHttps = true,
  network = 'TESTNET',
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
      <span className="flex items-center gap-1 text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {isHttps ? 'TLS Encrypted' : 'Insecure Connection'}
      </span>
      <span className="text-slate-500">•</span>
      <span className="text-cyan-400">{network} Sandbox</span>
    </div>
  );
};
