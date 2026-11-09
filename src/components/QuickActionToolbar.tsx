"use client";

import React from 'react';

export interface QuickActionToolbarProps {
  role: 'CLIENT' | 'PROVIDER' | 'ARBITER' | 'OBSERVER';
  status: string;
  onFund?: () => void;
  onSubmitMilestone?: () => void;
  onRaiseDispute?: () => void;
  onCancel?: () => void;
}

export const QuickActionToolbar: React.FC<QuickActionToolbarProps> = ({
  role,
  status,
  onFund,
  onSubmitMilestone,
  onRaiseDispute,
  onCancel,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-md flex items-center gap-2">
      {role === 'CLIENT' && status === 'CREATED' && onFund && (
        <button
          onClick={onFund}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
        >
          Fund Escrow
        </button>
      )}

      {role === 'PROVIDER' && status === 'FUNDED' && onSubmitMilestone && (
        <button
          onClick={onSubmitMilestone}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
        >
          Submit Work Proof
        </button>
      )}

      {(role === 'CLIENT' || role === 'PROVIDER') && status === 'FUNDED' && onRaiseDispute && (
        <button
          onClick={onRaiseDispute}
          className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/10 transition"
        >
          Raise Dispute
        </button>
      )}

      {status === 'CREATED' && onCancel && (
        <button
          onClick={onCancel}
          className="px-3 py-2 rounded-xl border border-white/10 text-slate-300 text-xs hover:bg-white/5 transition"
        >
          Cancel
        </button>
      )}
    </div>
  );
};
