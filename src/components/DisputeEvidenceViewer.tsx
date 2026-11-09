"use client";

import React from 'react';
import { DisputeEvidencePackage } from '../lib/security/disputeEvidenceSigner';

export interface DisputeEvidenceViewerProps {
  evidence: DisputeEvidencePackage;
}

export const DisputeEvidenceViewer: React.FC<DisputeEvidenceViewerProps> = ({ evidence }) => {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="font-semibold text-rose-300">Dispute Evidence Claim</span>
        <span className="font-mono text-[10px] text-slate-400">
          {new Date(evidence.timestamp).toLocaleString()}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="text-slate-400 text-[11px]">Claimant Public Key:</div>
        <div className="font-mono text-white text-[11px] truncate">{evidence.claimantPublicKey}</div>
      </div>

      <div className="space-y-1.5">
        <div className="text-slate-400 text-[11px]">Reason for Dispute:</div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-slate-200">
          {evidence.reason}
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-500">Signature Digest:</span>
        <span className="text-cyan-400">{evidence.signatureDigest}</span>
      </div>
    </div>
  );
};
