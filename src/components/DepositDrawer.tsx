"use client";
import React from 'react';

export interface DepositDrawerProps {
  isOpen: boolean;
  amount: string;
  symbol: string;
  estimatedFeeStroops?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DepositDrawer: React.FC<DepositDrawerProps> = ({ isOpen, amount, symbol, estimatedFeeStroops = 100, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-base font-bold text-white mb-2">Confirm Escrow Deposit</h3>
        <p className="text-xs text-slate-400 mb-4">
          You are about to deposit <strong className="text-emerald-400">{amount} {symbol}</strong> into the on-chain Soroban escrow vault.
        </p>
        <div className="bg-slate-950 p-3 rounded-xl mb-4 text-xs text-slate-400 flex justify-between font-mono">
          <span>Network Fee:</span>
          <span className="text-slate-300">{(estimatedFeeStroops / 10000000).toFixed(7)} XLM</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500">Confirm Deposit</button>
        </div>
      </div>
    </div>
  );
};
