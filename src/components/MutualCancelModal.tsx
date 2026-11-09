"use client";
import React from 'react';

export interface MutualCancelModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const MutualCancelModal: React.FC<MutualCancelModalProps> = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2">Mutual Cancellation Agreement</h3>
        <p className="text-xs text-slate-400 mb-4">
          Both client and provider signatures are required. All unapproved escrow funds will be refunded to the client.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Keep Agreement</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold">Confirm Cancel</button>
        </div>
      </div>
    </div>
  );
};
