'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, LogOut, ExternalLink } from 'lucide-react';
import { truncateAddress } from '../lib/stellar';
import { formatCurrencyAmount } from '../lib/account-balance';
import { useWallet } from '../context/WalletContext';
import { NetworkBanner } from './NetworkBanner';
import { getExplorerAccountUrl } from '../lib/stellar-network';

export default function Navbar() {
  const { address, network, balances, openWalletModal, disconnect } = useWallet();

  const formattedXlm = formatCurrencyAmount(balances.xlm, 2);

  return (
    <>
      <NetworkBanner />
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              SF
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Strata<span className="text-blue-400">Flow</span>
              </span>
              <span className="ml-2 text-[10px] font-mono uppercase bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-blue-300">
                {network}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-300 font-medium">
            <Link href="/agreements" className="hover:text-blue-400 transition-colors">
              Agreements
            </Link>
            <Link href="/create" className="hover:text-blue-400 transition-colors">
              New Escrow
            </Link>
            <a
              href="https://github.com/StrataFlow-Org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            {address ? (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl p-1 pl-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-200">{formattedXlm} XLM</span>
                  <span className="text-slate-500">|</span>
                  <a
                    href={getExplorerAccountUrl(address, network)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-blue-400 hover:underline flex items-center gap-1"
                    title={address}
                  >
                    {truncateAddress(address, 4)}
                  </a>
                </div>
                <button
                  onClick={disconnect}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Disconnect wallet"
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openWalletModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-95 transition-all shadow-md shadow-blue-600/20 active:scale-95"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
