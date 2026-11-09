"use client";

import React from 'react';

export interface TxHistoryItem {
  id: string;
  hash: string;
  description: string;
  timestamp: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  network?: string;
}

export interface TransactionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TxHistoryItem[];
  onClearHistory?: () => void;
}

export const TransactionHistoryDrawer: React.FC<TransactionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  transactions,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-white/10 h-full p-6 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Transaction History</h2>
            <p className="text-xs text-slate-400">Recent on-chain Soroban invocations</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No transactions recorded in this session.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white truncate max-w-[200px]">
                    {tx.description}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      tx.status === 'SUCCESS'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : tx.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-cyan-400 hover:underline"
                  >
                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)} ↗
                  </a>
                  <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {transactions.length > 0 && onClearHistory && (
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={onClearHistory}
              className="w-full py-2 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              Clear Session History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
