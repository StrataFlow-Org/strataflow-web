"use client";

import React, { useState } from 'react';

export interface GasPriceSliderProps {
  baseFeeStroops?: number;
  onFeeChange?: (feeStroops: number) => void;
}

export const GasPriceSlider: React.FC<GasPriceSliderProps> = ({
  baseFeeStroops = 100,
  onFeeChange,
}) => {
  const [fee, setFee] = useState(baseFeeStroops);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFee(val);
    onFeeChange?.(val);
  };

  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-slate-400">Max Base Fee</span>
        <span className="font-mono text-white font-semibold">{fee} stroops</span>
      </div>
      <input
        type="range"
        min={100}
        max={10000}
        step={100}
        value={fee}
        onChange={handleChange}
        className="w-full accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>Standard (100)</span>
        <span>High Priority (10k)</span>
      </div>
    </div>
  );
};
