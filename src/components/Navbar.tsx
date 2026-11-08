'use client';

import React from 'react';
import Link from 'next/link';
import { truncateAddress } from '../lib/stellar';
import { useWallet } from '../context/WalletContext';

export default function Navbar() {
  const { address, network, connect, disconnect } = useWallet();

  return (
    <header className="border-b border-brand-border bg-brand-surface/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-secondary to-brand-accent flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            SF
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              Strata<span className="text-brand-accent">Flow</span>
            </span>
            <span className="ml-2 text-xs font-mono uppercase bg-brand-border px-1.5 py-0.5 rounded text-neutral-400">
              {network}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm text-neutral-300">
          <Link href="/agreements" className="hover:text-white transition">Agreements</Link>
          <Link href="/create" className="hover:text-white transition">New Escrow</Link>
          <a href="https://github.com/StrataFlow-Org" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={address ? disconnect : connect}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-secondary to-brand-primary text-white text-sm font-medium hover:opacity-90 transition shadow-md shadow-indigo-600/30 font-mono"
          >
            {address ? truncateAddress(address, 5) : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </header>
  );
}
