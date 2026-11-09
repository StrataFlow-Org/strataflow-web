"use client";

import React from 'react';

export interface TokenAllowanceCheckerProps {
  requiredAmount: number;
  availableBalance: number;
  tokenSymbol: string;
  onTopUpClick?: () => void;
}

export const TokenAllowanceChecker: React.FC<TokenAllowanceCheckerProps> = ({
  requiredAmount,
  availableBalance,
  tokenSymbol,
  onTopUpClick,
}) => {
  const isSufficient = availableBalance >= requiredAmount;
  const difference = requiredAmount - availableBalance;

  return (
    <div
      className={`p-3 rounded-xl border text-xs transition ${
        isSufficient
          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
          : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{isSufficient ? '✓ Sufficient Balance' : '⚠ Insufficient Balance'}</span>
        </div>
        <span className="font-mono">
          {availableBalance.toLocaleString()} / {requiredAmount.toLocaleString()} {tokenSymbol}
        </span>
      </div>
      {!isSufficient && (
        <div className="mt-2 flex items-center justify-between border-t border-amber-500/10 pt-2 text-[11px] text-slate-300">
          <span>You need {difference.toLocaleString()} more {tokenSymbol} to fund this escrow.</span>
          {onTopUpClick && (
            <button
              type="button"
              onClick={onTopUpClick}
              className="text-amber-400 hover:underline font-medium"
            >
              Get Testnet Tokens ↗
            </button>
          )}
        </div>
      )}
    </div>
  );
};
