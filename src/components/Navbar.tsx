'use client';

import React, { useState } from 'react';
import { truncateAddress, STELLAR_CONFIG } from '../lib/stellar';

export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = () => {
    // Simulated freighter connect for preview
    if (!walletAddress) {
      setWalletAddress('GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS');
    } else {
      setWalletAddress(null);
    }
  };

  return (
    <header className="border-b border-brand-border bg-brand-surface/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-secondary to-brand-accent flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            SF
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              Strata<span className="text-brand-accent">Flow</span>
            </span>
            <span className="ml-2 text-xs font-mono uppercase bg-brand-border px-1.5 py-0.5 rounded text-neutral-400">
              {STELLAR_CONFIG.network}
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm text-neutral-300">
          <a href="#" className="hover:text-white transition">Agreements</a>
          <a href="#" className="hover:text-white transition">Milestones</a>
          <a href="#" className="hover:text-white transition">Arbitration</a>
          <a href="https://github.com/winningtalker-commits" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleConnect}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-secondary to-brand-primary text-white text-sm font-medium hover:opacity-90 transition shadow-md shadow-indigo-600/30"
          >
            {walletAddress ? truncateAddress(walletAddress, 5) : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}
