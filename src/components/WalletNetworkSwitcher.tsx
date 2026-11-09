"use client";

import React, { useState } from 'react';

export interface WalletNetworkSwitcherProps {
  currentNetwork: 'TESTNET' | 'MAINNET' | 'FUTURENET';
  onNetworkChange?: (network: 'TESTNET' | 'MAINNET' | 'FUTURENET') => void;
}

export const WalletNetworkSwitcher: React.FC<WalletNetworkSwitcherProps> = ({
  currentNetwork,
  onNetworkChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<'TESTNET' | 'MAINNET' | 'FUTURENET' | null>(null);

  const networks = [
    { id: 'TESTNET' as const, name: 'Stellar Testnet', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'MAINNET' as const, name: 'Stellar Public (Mainnet)', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'FUTURENET' as const, name: 'Stellar Futurenet', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  ];

  const handleSelect = (net: 'TESTNET' | 'MAINNET' | 'FUTURENET') => {
    if (net === 'MAINNET') {
      setPendingNetwork(net);
    } else {
      onNetworkChange?.(net);
      setIsOpen(false);
    }
  };

  const confirmMainnet = () => {
    if (pendingNetwork) {
      onNetworkChange?.(pendingNetwork);
      setPendingNetwork(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 transition"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>{currentNetwork}</span>
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-50 p-1">
          <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Select Stellar Network
          </div>
          {networks.map((net) => (
            <button
              key={net.id}
              onClick={() => handleSelect(net.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition ${
                currentNetwork === net.id ? 'bg-white/10 text-white font-medium' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span>{net.name}</span>
              {currentNetwork === net.id && (
                <span className="text-emerald-400 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {pendingNetwork && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-white">Switch to Stellar Mainnet?</h3>
            <p className="mt-2 text-xs text-slate-300">
              You are about to switch to Stellar Mainnet. Transactions will execute with real assets.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingNetwork(null)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmMainnet}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400"
              >
                Confirm Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
