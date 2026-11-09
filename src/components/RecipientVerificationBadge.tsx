"use client";

import React from 'react';

export interface RecipientVerificationBadgeProps {
  address: string;
  isAccountActive?: boolean;
}

export const RecipientVerificationBadge: React.FC<RecipientVerificationBadgeProps> = ({
  address,
  isAccountActive = true,
}) => {
  const isValidFormat = address.startsWith('G') && address.length === 56;

  if (!isValidFormat) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
        ⚠ Invalid Key Format
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
        isAccountActive
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      }`}
    >
      <span>{isAccountActive ? '✓ Active Stellar Account' : '⚠ Unfunded Horizon Account'}</span>
    </span>
  );
};
