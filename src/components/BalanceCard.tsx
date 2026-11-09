"use client";
import React from 'react';

export interface BalanceCardProps {
  symbol: string;
  balance: string;
  formattedFiat?: string;
  onSelectToken?: (symbol: string) => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ symbol, balance, formattedFiat, onSelectToken }) => {
  return (
    <div
      onClick={() => onSelectToken && onSelectToken(symbol)}
      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
    >
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span>Asset Balance</span>
        <span className="font-semibold text-slate-200">{symbol}</span>
      </div>
      <div className="text-xl font-bold text-white font-mono">{balance}</div>
      {formattedFiat && <div className="text-xs text-slate-500 mt-1">≈ {formattedFiat}</div>}
    </div>
  );
};
