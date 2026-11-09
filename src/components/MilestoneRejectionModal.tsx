"use client";
import React, { useState } from 'react';

export interface MilestoneRejectionModalProps {
  isOpen: boolean;
  milestoneTitle: string;
  onReject: (reason: string) => void;
  onClose: () => void;
}

export const MilestoneRejectionModal: React.FC<MilestoneRejectionModalProps> = ({ isOpen, milestoneTitle, onReject, onClose }) => {
  const [reason, setReason] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-red-400 mb-2">Reject Milestone Deliverable</h3>
        <p className="text-xs text-slate-400 mb-3">Provide feedback to the provider explaining why {milestoneTitle} requires revision.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Detailed feedback..."
          className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 mb-4 resize-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Cancel</button>
          <button
            disabled={!reason.trim()}
            onClick={() => { onReject(reason); onClose(); }}
            className="flex-1 py-2 rounded-xl bg-red-600/80 text-white text-xs font-semibold disabled:opacity-40 hover:bg-red-500"
          >
            Submit Rejection
          </button>
        </div>
      </div>
    </div>
  );
};
