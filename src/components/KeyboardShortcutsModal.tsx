"use client";

import React, { useEffect, useState } from 'react';

export interface ShortcutItem {
  key: string;
  description: string;
}

export const KeyboardShortcutsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: ShortcutItem[] = [
    { key: '?', description: 'Toggle this keyboard shortcuts dialog' },
    { key: '/', description: 'Quick search agreements' },
    { key: 'Esc', description: 'Close any active modal or drawer' },
    { key: 'c', description: 'Create new agreement' },
    { key: 'r', description: 'Refresh agreement state' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-semibold text-white">Keyboard Shortcuts</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 space-y-2.5">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between text-xs">
              <span className="text-slate-300">{sc.description}</span>
              <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 font-mono text-[11px] text-white">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
