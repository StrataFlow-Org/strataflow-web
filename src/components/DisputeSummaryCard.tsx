"use client";
import React from 'react';

export interface DisputeSummaryCardProps {
  clientPayout: number | string;
  providerPayout: number | string;
  protocolFee?: number | string;
  symbol?: string;
  verdictDate?: string;
}

export const DisputeSummaryCard: React.FC<DisputeSummaryCardProps> = ({ clientPayout, providerPayout, protocolFee, symbol = 'XLM', verdictDate }) => {
  return (
    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
      <div className="flex justify-between font-bold text-amber-400">
        <span>Arbiter Verdict Resolved</span>
        {verdictDate && <span className="font-mono text-slate-400">{verdictDate}</span>}
      </div>
      <div className="flex justify-between text-slate-300">
        <span>Client Award:</span>
        <span className="font-mono">{clientPayout} {symbol}</span>
      </div>
      <div className="flex justify-between text-slate-300">
        <span>Provider Award:</span>
        <span className="font-mono">{providerPayout} {symbol}</span>
      </div>
      {protocolFee && (
        <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-amber-500/20">
          <span>Protocol Fee:</span>
          <span className="font-mono">{protocolFee} {symbol}</span>
        </div>
      )}
    </div>
  );
};
