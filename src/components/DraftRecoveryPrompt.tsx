"use client";

import React from 'react';

export interface DraftRecoveryPromptProps {
  isOpen: boolean;
  onRestore: () => void;
  onDiscard: () => void;
}

export const DraftRecoveryPrompt: React.FC<DraftRecoveryPromptProps> = ({
  isOpen,
  onRestore,
  onDiscard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm bg-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="text-xl">📝</span>
        <div>
          <h4 className="text-xs font-semibold text-white">Unsaved Draft Found</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Would you like to resume your previous agreement draft?
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={onDiscard}
          className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
        >
          Discard
        </button>
        <button
          onClick={onRestore}
          className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400"
        >
          Restore
        </button>
      </div>
    </div>
  );
};
