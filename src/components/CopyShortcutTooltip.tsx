"use client";

import React, { useState } from 'react';

export interface CopyShortcutTooltipProps {
  textToCopy: string;
  label?: string;
}

export const CopyShortcutTooltip: React.FC<CopyShortcutTooltipProps> = ({
  textToCopy,
  label = 'Copy',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition"
      aria-label={`Copy ${label} to clipboard`}
    >
      <span>{copied ? '✓ Copied' : label}</span>
    </button>
  );
};
