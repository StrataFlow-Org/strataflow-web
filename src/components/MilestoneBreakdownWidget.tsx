"use client";
import React from 'react';

export interface MilestoneBreakdownWidgetProps {
  totalAmount: number | bigint;
  releasedAmount: number | bigint;
  symbol?: string;
}

export const MilestoneBreakdownWidget: React.FC<MilestoneBreakdownWidgetProps> = ({ totalAmount, releasedAmount, symbol = 'XLM' }) => {
  const total = Number(totalAmount);
  const released = Number(releasedAmount);
  const pct = total > 0 ? Math.round((released / total) * 100) : 0;

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="flex justify-between text-xs text-slate-400 mb-2">
        <span>Escrow Progress</span>
        <span className="font-semibold text-slate-200">{pct}% Complete</span>
      </div>
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
        <span>{released} {symbol} Released</span>
        <span>{total} {symbol} Total</span>
      </div>
    </div>
  );
};
