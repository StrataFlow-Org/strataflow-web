"use client";
import React from 'react';

export interface AutoRefreshToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  intervalSeconds?: number;
}

export const AutoRefreshToggle: React.FC<AutoRefreshToggleProps> = ({ enabled, onToggle, intervalSeconds = 10 }) => {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
        enabled
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-slate-900 text-slate-500 border-slate-800'
      }`}
    >
      Auto-sync {enabled ? `(${intervalSeconds}s)` : 'Off'}
    </button>
  );
};
