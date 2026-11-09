"use client";
import React, { useState } from 'react';

export interface ArbiterReassignModalProps {
  isOpen: boolean;
  onReassign: (newArbiter: string) => void;
  onClose: () => void;
}

export const ArbiterReassignModal: React.FC<ArbiterReassignModalProps> = ({ isOpen, onReassign, onClose }) => {
  const [addr, setAddr] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2">Reassign Arbiter</h3>
        <input
          type="text"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          placeholder="New Arbiter G... address"
          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white mb-4 focus:outline-none focus:border-blue-500 font-mono"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
          <button
            disabled={!addr.startsWith('G') || addr.length !== 56}
            onClick={() => { onReassign(addr); onClose(); }}
            className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold disabled:opacity-40"
          >
            Reassign
          </button>
        </div>
      </div>
    </div>
  );
};
