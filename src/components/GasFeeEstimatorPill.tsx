"use client";

import React from 'react';

export interface GasFeeEstimatorPillProps {
  estimatedFeeStroops?: number;
  isSufficientGas?: boolean;
}

export const GasFeeEstimatorPill: React.FC<GasFeeEstimatorPillProps> = ({
  estimatedFeeStroops = 100,
  isSufficientGas = true,
}) => {
  const feeXlm = (estimatedFeeStroops / 10_000_000).toFixed(6);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${
        isSufficientGas
          ? 'bg-slate-900 border-white/10 text-slate-300'
          : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
      <span>Est. Fee: {feeXlm} XLM</span>
      {!isSufficientGas && <span className="text-rose-400 font-bold ml-1">Low Gas</span>}
    </div>
  );
};
