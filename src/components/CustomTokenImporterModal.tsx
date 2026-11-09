"use client";

import React, { useState } from 'react';

export interface CustomTokenImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportToken?: (contractAddress: string) => void;
}

export const CustomTokenImporterModal: React.FC<CustomTokenImporterModalProps> = ({
  isOpen,
  onClose,
  onImportToken,
}) => {
  const [tokenAddress, setTokenAddress] = useState('');

  if (!isOpen) return null;

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenAddress.startsWith('C') && tokenAddress.length === 56) {
      onImportToken?.(tokenAddress);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-base font-semibold text-white">Import Custom SAC Token</h3>
        <p className="text-xs text-slate-400 mt-1">
          Enter the Soroban Stellar Asset Contract (SAC) address (56 characters starting with C).
        </p>

        <form onSubmit={handleImport} className="mt-4 space-y-4">
          <input
            type="text"
            required
            placeholder="CB64..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value.trim())}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-white focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
            >
              Import Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
