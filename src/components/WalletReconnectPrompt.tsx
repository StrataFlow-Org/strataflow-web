"use client";

import React from 'react';

export interface WalletReconnectPromptProps {
  onReconnect: () => void;
}

export const WalletReconnectPrompt: React.FC<WalletReconnectPromptProps> = ({ onReconnect }) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-slate-300">
        <span>🔌</span>
        <span>Wallet disconnected. Reconnect to sign transactions and view balances.</span>
      </div>
      <button
        type="button"
        onClick={onReconnect}
        className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
      >
        Connect
      </button>
    </div>
  );
};
