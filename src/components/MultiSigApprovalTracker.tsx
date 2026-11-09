"use client";

import React from 'react';

export interface MultiSigApprovalTrackerProps {
  requiredSignatures: number;
  collectedSignatures: number;
}

export const MultiSigApprovalTracker: React.FC<MultiSigApprovalTrackerProps> = ({
  requiredSignatures,
  collectedSignatures,
}) => {
  const isSatisfied = collectedSignatures >= requiredSignatures;

  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isSatisfied ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <span className="text-slate-300">Multi-Signature Threshold:</span>
      </div>
      <div className="font-mono font-semibold text-white">
        {collectedSignatures} / {requiredSignatures} Signatures
      </div>
    </div>
  );
};
