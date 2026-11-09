"use client";

import React, { useState } from 'react';
import { compareProofHashes } from '../lib/security/proofIntegrityChecker';

export interface ProofVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedHash: string;
}

export const ProofVerificationModal: React.FC<ProofVerificationModalProps> = ({
  isOpen,
  onClose,
  expectedHash,
}) => {
  const [inputHash, setInputHash] = useState('');
  const [matchResult, setMatchResult] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const isMatch = compareProofHashes(expectedHash, inputHash);
    setMatchResult(isMatch);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-base font-semibold text-white">Verify Deliverable Fingerprint</h3>
        <p className="text-xs text-slate-400 mt-1">
          Verify local deliverable against the hash committed to the Stellar ledger.
        </p>

        <form onSubmit={handleVerify} className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Committed On-Chain Hash</label>
            <div className="p-2 rounded-xl bg-slate-950 font-mono text-xs text-cyan-400 break-all border border-white/5">
              {expectedHash}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Local Deliverable Hash</label>
            <input
              type="text"
              required
              placeholder="Paste SHA-256 or IPFS CID to compare..."
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value.trim())}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          {matchResult !== null && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold ${
                matchResult
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              {matchResult ? '✓ Hashes Match! Deliverable Verified' : '✕ Hash Mismatch! Deliverable Altered'}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
            >
              Verify Fingerprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
