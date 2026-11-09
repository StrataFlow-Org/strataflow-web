"use client";
import React from 'react';

export interface ProtocolFeeBannerProps {
  feeBps: number;
}

export const ProtocolFeeBanner: React.FC<ProtocolFeeBannerProps> = ({ feeBps }) => {
  const pct = (feeBps / 100).toFixed(2);
  return (
    <div className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
      <span>Protocol Fee Rate</span>
      <span className="font-mono text-slate-200 font-semibold">{pct}% ({feeBps} bps)</span>
    </div>
  );
};
