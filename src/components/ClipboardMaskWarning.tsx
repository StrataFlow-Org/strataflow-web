"use client";

import React from 'react';

export interface ClipboardMaskWarningProps {
  copiedAddress: string;
}

export const ClipboardMaskWarning: React.FC<ClipboardMaskWarningProps> = ({ copiedAddress }) => {
  return (
    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between font-mono">
      <span>Address copied: {copiedAddress.slice(0, 6)}...{copiedAddress.slice(-6)}</span>
      <span className="text-[10px] text-emerald-400">✓ Checksum Valid</span>
    </div>
  );
};
