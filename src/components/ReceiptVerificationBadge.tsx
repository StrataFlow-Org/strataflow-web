"use client";

import React from 'react';

export interface ReceiptVerificationBadgeProps {
  isValid: boolean;
  checksum: string;
}

export const ReceiptVerificationBadge: React.FC<ReceiptVerificationBadgeProps> = ({
  isValid,
  checksum,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border ${
        isValid
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isValid ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <span>{isValid ? 'Receipt Verified' : 'Invalid Checksum'}</span>
      <span className="text-slate-500">({checksum.slice(0, 8)})</span>
    </div>
  );
};
