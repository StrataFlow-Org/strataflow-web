"use client";

import React from 'react';

export interface ContractInteractionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  methodName: string;
  contractId: string;
  feeEstimateXlm?: string;
  isSubmitting?: boolean;
}

export const ContractInteractionConfirmModal: React.FC<ContractInteractionConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  methodName,
  contractId,
  feeEstimateXlm = '0.000100',
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-base font-semibold text-white">Confirm Soroban Invocation</h3>
        <p className="text-xs text-slate-400 mt-1">
          Review on-chain contract invocation details before wallet signing.
        </p>

        <div className="mt-4 p-3 bg-slate-950 rounded-xl space-y-2 border border-white/5 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Method:</span>
            <span className="text-cyan-400 font-semibold">{methodName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Contract:</span>
            <span className="text-slate-300 truncate max-w-[200px]">{contractId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Est. Max Fee:</span>
            <span className="text-slate-300">{feeEstimateXlm} XLM</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
          >
            {isSubmitting ? 'Signing in Wallet...' : 'Confirm & Sign'}
          </button>
        </div>
      </div>
    </div>
  );
};
