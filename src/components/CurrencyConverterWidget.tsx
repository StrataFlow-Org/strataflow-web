"use client";

import React, { useState } from 'react';

export interface CurrencyConverterWidgetProps {
  amountStroops: bigint | number;
  xlmRateUsd?: number;
}

export const CurrencyConverterWidget: React.FC<CurrencyConverterWidgetProps> = ({
  amountStroops,
  xlmRateUsd = 0.12,
}) => {
  const [viewUnit, setViewUnit] = useState<'XLM' | 'USD' | 'STROOPS'>('XLM');

  const stroopsNum = typeof amountStroops === 'bigint' ? Number(amountStroops) : amountStroops;
  const xlmAmount = stroopsNum / 10_000_000;
  const usdAmount = xlmAmount * xlmRateUsd;

  return (
    <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
      <div className="font-mono font-medium text-white px-2">
        {viewUnit === 'XLM' && `${xlmAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} XLM`}
        {viewUnit === 'USD' && `$${usdAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`}
        {viewUnit === 'STROOPS' && `${stroopsNum.toLocaleString()} stroops`}
      </div>
      <div className="flex bg-slate-900/60 rounded-lg p-0.5 border border-white/5">
        {(['XLM', 'USD', 'STROOPS'] as const).map((unit) => (
          <button
            key={unit}
            type="button"
            onClick={() => setViewUnit(unit)}
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md transition ${
              viewUnit === unit ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {unit}
          </button>
        ))}
      </div>
    </div>
  );
};
