"use client";
import React from 'react';

export interface AgreementCardProps {
  id: number | string;
  title: string;
  status: string;
  totalAmount: number | string;
  symbol?: string;
  progressPct?: number;
  onView?: (id: number | string) => void;
}

export const AgreementCard: React.FC<AgreementCardProps> = ({ id, title, status, totalAmount, symbol = 'XLM', progressPct = 0, onView }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[11px] font-mono text-slate-500">#{id}</span>
          <h4 className="text-sm font-bold text-white mt-0.5">{title}</h4>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
          {status}
        </span>
      </div>
      <div className="my-3">
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
        <span className="font-mono text-slate-300 font-bold">{totalAmount} {symbol}</span>
        {onView && (
          <button onClick={() => onView(id)} className="text-blue-400 hover:text-blue-300 font-semibold">
            View Details →
          </button>
        )}
      </div>
    </div>
  );
};
