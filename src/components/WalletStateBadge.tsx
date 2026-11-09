"use client";
import React from 'react';

export interface WalletStateBadgeProps {
  connected: boolean;
  address?: string;
  network?: string;
  onConnect?: () => void;
}

export const WalletStateBadge: React.FC<WalletStateBadgeProps> = ({ connected, address, network = 'TESTNET', onConnect }) => {
  if (!connected) {
    return (
      <button
        onClick={onConnect}
        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-semibold"
      >
        Connect Wallet
      </button>
    );
  }

  const truncated = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>{truncated}</span>
      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">{network}</span>
    </div>
  );
};
