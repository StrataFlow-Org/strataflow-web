"use client";

import React from 'react';

export interface CompactAgreementRowProps {
  id: string | number;
  title: string;
  status: string;
  amount: number;
  currency?: string;
  onClick?: () => void;
}

export const CompactAgreementRow: React.FC<CompactAgreementRowProps> = ({
  id,
  title,
  status,
  amount,
  currency = 'XLM',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition text-xs"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-slate-500">#{id}</span>
        <span className="font-medium text-white truncate max-w-[200px]">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-cyan-400 font-semibold">{amount} {currency}</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300">
          {status}
        </span>
      </div>
    </div>
  );
};
