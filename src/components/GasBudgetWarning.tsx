"use client";
import React from 'react';

export interface GasBudgetWarningProps {
  balanceXlm: number;
  minThreshold?: number;
}

export const GasBudgetWarning: React.FC<GasBudgetWarningProps> = ({ balanceXlm, minThreshold = 2.0 }) => {
  if (balanceXlm >= minThreshold) return null;
  return (
    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-center gap-2">
      <span>⚠️</span>
      <span>Low XLM balance ({balanceXlm.toFixed(2)} XLM). You may not have enough for Soroban gas fees.</span>
    </div>
  );
};
