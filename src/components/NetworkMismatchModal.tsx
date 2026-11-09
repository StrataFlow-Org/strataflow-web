"use client";
import React from 'react';

export interface NetworkMismatchModalProps {
  isOpen: boolean;
  expectedNetwork: string;
  actualNetwork: string;
  onClose: () => void;
}

export const NetworkMismatchModal: React.FC<NetworkMismatchModalProps> = ({ isOpen, expectedNetwork, actualNetwork, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-slate-200 shadow-xl">
        <h3 className="text-lg font-bold text-amber-400 mb-2">Network Mismatch Detected</h3>
        <p className="text-sm text-slate-400 mb-4">
          Your wallet is connected to <strong className="text-white">{actualNetwork}</strong>, but StrataFlow is configured for <strong className="text-white">{expectedNetwork}</strong>. Please switch networks in your wallet extension.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-400 font-semibold hover:bg-amber-500/30 border border-amber-500/30 text-xs transition"
        >
          Acknowledge & Dismiss
        </button>
      </div>
    </div>
  );
};
