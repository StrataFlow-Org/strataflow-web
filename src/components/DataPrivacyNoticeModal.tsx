"use client";

import React from 'react';

export interface DataPrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataPrivacyNoticeModal: React.FC<DataPrivacyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-base font-semibold text-white">Stellar Ledger Data & Privacy</h3>
        <p className="text-xs text-slate-400 mt-1">
          How your data is handled on-chain and off-chain
        </p>

        <div className="mt-4 space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="font-semibold text-emerald-400 block mb-0.5">On-Chain (Public):</span>
            Agreement terms, milestone amounts, and participant public addresses are irreversibly recorded on the Stellar ledger.
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="font-semibold text-cyan-400 block mb-0.5">Off-Chain (Private):</span>
            Your private keys and secret seeds never leave your browser extension wallet.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
