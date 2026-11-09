"use client";
import React, { useState } from 'react';

export interface DisputeSplitSliderProps {
  totalBalance: number;
  symbol: string;
  onSplitChange: (clientShare: number, providerShare: number) => void;
}

export const DisputeSplitSlider: React.FC<DisputeSplitSliderProps> = ({ totalBalance, symbol, onSplitChange }) => {
  const [clientPct, setClientPct] = useState(50);
  const providerPct = 100 - clientPct;

  const clientAmount = ((totalBalance * clientPct) / 100).toFixed(2);
  const providerAmount = ((totalBalance * providerPct) / 100).toFixed(2);

  const handleSlider = (val: number) => {
    setClientPct(val);
    onSplitChange(parseFloat(clientAmount), parseFloat(providerAmount));
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
      <div className="flex justify-between font-semibold mb-2">
        <span>Client: {clientAmount} {symbol} ({clientPct}%)</span>
        <span>Provider: {providerAmount} {symbol} ({providerPct}%)</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={clientPct}
        onChange={(e) => handleSlider(parseInt(e.target.value, 10))}
        className="w-full accent-blue-500 cursor-pointer"
      />
    </div>
  );
};
