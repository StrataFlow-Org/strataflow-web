"use client";

import React from 'react';

export interface NetworkGuardModalProps {
  isOpen: boolean;
  expectedNetwork: string;
  actualNetwork: string;
  onDismiss: () => void;
}

export const NetworkGuardModal: React.FC<NetworkGuardModalProps> = ({
  isOpen,
  expectedNetwork,
  actualNetwork,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center text-lg mb-3">
          ⚠
        </div>
        <h3 className="text-base font-semibold text-white">Network Isolation Safety Check</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          The requested operation targets <strong>{expectedNetwork}</strong>, but your wallet is currently connected to <strong>{actualNetwork}</strong>.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onDismiss}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
          >
            Switch Network in Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
