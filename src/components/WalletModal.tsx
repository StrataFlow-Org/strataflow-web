'use client';

import React from 'react';
import { X, Wallet, ExternalLink, ShieldCheck } from 'lucide-react';

export interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isInstalled?: boolean;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => Promise<void>;
  isLoading: boolean;
}

export function WalletModal({ isOpen, onClose, onSelectWallet, isLoading }: WalletModalProps) {
  if (!isOpen) return null;

  const walletOptions: WalletOption[] = [
    {
      id: 'freighter',
      name: 'Freighter Wallet',
      description: 'Official browser extension by the Stellar Development Foundation',
    },
    {
      id: 'albedo',
      name: 'Albedo',
      description: 'Web-based delegated signing without installing browser extensions',
    },
    {
      id: 'xbull',
      name: 'xBull Wallet',
      description: 'Feature-rich multi-platform Stellar and Soroban wallet',
    },
    {
      id: 'demo',
      name: 'Testnet Demo Account',
      description: 'Instant pre-funded test account for evaluation & preview',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-slate-800 p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Connect Wallet</h2>
            <p className="text-xs text-slate-400">Select your preferred Stellar / Soroban provider</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {walletOptions.map((w) => (
            <button
              key={w.id}
              onClick={() => onSelectWallet(w.id)}
              disabled={isLoading}
              className="w-full text-left p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all flex items-start justify-between group disabled:opacity-50"
            >
              <div>
                <div className="font-semibold text-sm text-slate-200 group-hover:text-blue-400 flex items-center gap-2">
                  {w.name}
                  {w.id === 'demo' && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                      Instant
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{w.description}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors mt-0.5 shrink-0" />
            </button>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Non-custodial & secure</span>
          </div>
          <a
            href="https://www.freighter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Get Freighter &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
