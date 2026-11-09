"use client";

import React from 'react';

export interface LedgerSyncStatusPillProps {
  isSynced: boolean;
  lagBlocks?: number;
}

export const LedgerSyncStatusPill: React.FC<LedgerSyncStatusPillProps> = ({
  isSynced,
  lagBlocks = 0,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
        isSynced
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isSynced ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      <span>{isSynced ? 'Ledger Synced' : `Syncing (-${lagBlocks} blocks)`}</span>
    </div>
  );
};
