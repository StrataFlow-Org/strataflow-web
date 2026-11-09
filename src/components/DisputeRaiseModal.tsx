"use client";
import React, { useState } from 'react';

export interface DisputeRaiseModalProps {
  isOpen: boolean;
  onRaise: (reason: string) => void;
  onClose: () => void;
}

export const DisputeRaiseModal: React.FC<DisputeRaiseModalProps> = ({ isOpen, onRaise, onClose }) => {
  const [reason, setReason] = useState('Non-delivery of agreed scope');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-amber-400 mb-2">Raise On-Chain Dispute</h3>
        <p className="text-xs text-slate-400 mb-3">Escrow funds will be locked until the designated arbiter resolves the dispute.</p>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white mb-4 focus:outline-none"
        >
          <option>Non-delivery of agreed scope</option>
          <option>Deliverable does not meet technical requirements</option>
          <option>Communication breakdown / unresponsive</option>
          <option>Other contractual breach</option>
        </select>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
          <button onClick={() => { onRaise(reason); onClose(); }} className="flex-1 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold">
            Open Dispute
          </button>
        </div>
      </div>
    </div>
  );
};
