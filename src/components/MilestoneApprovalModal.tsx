"use client";
import React from 'react';

export interface MilestoneApprovalModalProps {
  isOpen: boolean;
  amount: string;
  symbol: string;
  feeNotice?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const MilestoneApprovalModal: React.FC<MilestoneApprovalModalProps> = ({ isOpen, amount, symbol, feeNotice, onConfirm, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-emerald-400 mb-2">Approve Milestone & Release Funds</h3>
        <p className="text-xs text-slate-300 mb-3">
          This will release <strong className="text-white">{amount} {symbol}</strong> directly to the provider.
        </p>
        {feeNotice && <p className="text-[11px] text-slate-500 mb-4 bg-slate-950 p-2.5 rounded-lg font-mono">{feeNotice}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">
            Confirm & Release
          </button>
        </div>
      </div>
    </div>
  );
};
