"use client";
import React, { useState } from 'react';

export interface MilestoneSubmissionModalProps {
  isOpen: boolean;
  milestoneIdx: number;
  onSubmit: (proofHash: string) => void;
  onClose: () => void;
}

export const MilestoneSubmissionModal: React.FC<MilestoneSubmissionModalProps> = ({ isOpen, milestoneIdx, onSubmit, onClose }) => {
  const [proof, setProof] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2">Submit Milestone #{milestoneIdx + 1} Proof</h3>
        <p className="text-xs text-slate-400 mb-4">Provide an IPFS CID or deliverable URL for review.</p>
        <input
          type="text"
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          placeholder="Qm... or bafy... or https://"
          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white mb-4 focus:outline-none focus:border-blue-500 font-mono"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
          <button
            disabled={!proof.trim()}
            onClick={() => { onSubmit(proof); onClose(); }}
            className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold disabled:opacity-40"
          >
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
};
