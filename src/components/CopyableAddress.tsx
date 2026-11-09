"use client";
import React, { useState } from 'react';

export interface CopyableAddressProps {
  address: string;
}

export const CopyableAddress: React.FC<CopyableAddressProps> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncated = `${address.slice(0, 6)}...${address.slice(-6)}`;
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-xs font-mono hover:bg-slate-700 transition"
      title="Click to copy full address"
    >
      <span>{truncated}</span>
      <span className="text-[10px] text-slate-500">{copied ? '✓' : '⧉'}</span>
    </button>
  );
};
