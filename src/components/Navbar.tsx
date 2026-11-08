'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wallet, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { truncateAddress } from '../lib/stellar';
import { formatCurrencyAmount } from '../lib/account-balance';
import { useWallet } from '../context/WalletContext';
import { NetworkBanner } from './NetworkBanner';
import { getExplorerAccountUrl } from '../lib/stellar-network';

export default function Navbar() {
  const { address, network, balances, openWalletModal, disconnect } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Desktop Nav */}
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

          <div className="hidden md:flex items-center space-x-3">
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

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-4">
            <nav className="flex flex-col space-y-2 text-sm text-slate-200">
              <Link
                href="/agreements"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 transition"
              >
                Agreements Directory
              </Link>
              <Link
                href="/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-800 transition"
              >
                Create New Escrow
              </Link>
              <a
                href="https://github.com/StrataFlow-Org"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg hover:bg-slate-800 transition flex items-center justify-between"
              >
                <span>GitHub Repositories</span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            </nav>

            <div className="pt-2 border-t border-slate-800">
              {address ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400 font-mono truncate">Connected: {address}</div>
                  <div className="text-sm font-bold text-white">{formattedXlm} XLM</div>
                  <button
                    onClick={() => {
                      disconnect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    openWalletModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
