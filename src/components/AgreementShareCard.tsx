"use client";

import React from 'react';

export interface AgreementShareCardProps {
  id: string | number;
  title: string;
  amount: number;
  currency?: string;
}

export const AgreementShareCard: React.FC<AgreementShareCardProps> = ({
  id,
  title,
  amount,
  currency = 'XLM',
}) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 max-w-sm">
      <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono">
        <span>STRATAFLOW ESCROW #{id}</span>
        <span>STELLAR NETWORK</span>
      </div>
      <h3 className="text-sm font-semibold text-white mt-2 truncate">{title}</h3>
      <div className="mt-4 text-xl font-bold text-white font-mono">
        {amount} {currency}
      </div>
      <div className="mt-2 text-[10px] text-slate-500">
        Secured by Soroban smart contract escrow & multi-party consensus
      </div>
    </div>
  );
};
