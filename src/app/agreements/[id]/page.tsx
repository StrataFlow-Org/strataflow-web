'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';

export default function AgreementDetailPage() {
  const params = useParams();
  const agreementId = params?.id || '1';
  const { address } = useWallet();

  const [status, setStatus] = useState<'Funded' | 'Completed' | 'Disputed'>('Funded');
  const [balance, setBalance] = useState(4500);
  const [milestones, setMilestones] = useState([
    {
      id: 0,
      title: 'Phase 1: Architecture Blueprint & Soroban Interface Specs',
      amount: 1500,
      status: 'Approved',
      proofCid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    },
    {
      id: 1,
      title: 'Phase 2: Contract Implementation & Testnet Deployment',
      amount: 2500,
      status: 'Submitted',
      proofCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    },
    {
      id: 2,
      title: 'Phase 3: Integration Testing & Mainnet Audit Handover',
      amount: 2000,
      status: 'Pending',
      proofCid: '',
    },
  ]);

  const [inputCid, setInputCid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRelease = (idx: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = [...milestones];
      const releasedAmount = updated[idx].amount;
      updated[idx].status = 'Approved';
      setMilestones(updated);
      setBalance((b) => Math.max(0, b - releasedAmount));
      setIsProcessing(false);
    }, 1000);
  };

  const handleSubmitProof = (idx: number) => {
    if (!inputCid) return;
    setIsProcessing(true);
    setTimeout(() => {
      const updated = [...milestones];
      updated[idx].status = 'Submitted';
      updated[idx].proofCid = inputCid;
      setMilestones(updated);
      setInputCid('');
      setIsProcessing(false);
    }, 800);
  };

  const handleDispute = (idx: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = [...milestones];
      updated[idx].status = 'Disputed';
      setMilestones(updated);
      setStatus('Disputed');
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/agreements" className="text-xs font-mono text-brand-primary hover:underline">
          ← Back to Agreements
        </Link>
      </div>

      {/* Header */}
      <div className="p-6 rounded-xl border border-brand-border bg-brand-surface mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/60">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-brand-primary font-bold">#{agreementId}</span>
              <h1 className="text-2xl font-bold text-white">Soroban Indexer & Webhook Service Integration</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {status}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              Created: 2026-11-01 · Deadline: 2026-12-01 · Asset: Circle USDC
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-neutral-400 font-mono">Contract Balance</span>
            <p className="text-2xl font-bold text-white font-mono">{balance.toLocaleString()} USDC</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs font-mono">
          <div>
            <span className="text-neutral-500">Client:</span>
            <p className="text-neutral-300 truncate">GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS</p>
          </div>
          <div>
            <span className="text-neutral-500">Provider:</span>
            <p className="text-neutral-300 truncate">GCP7XYZTESTNETPROVIDERADDRESS2026COMMITS</p>
          </div>
          <div>
            <span className="text-neutral-500">Arbiter:</span>
            <p className="text-neutral-300 truncate">GARBITEROFFICIALSTELLARRESOLVER2026KEY</p>
          </div>
        </div>
      </div>

      {/* Milestones Flow */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Milestone Verification Lifecycle</h2>

        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className="p-6 rounded-xl border border-brand-border bg-brand-surface/90 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-brand-border flex items-center justify-center text-xs font-mono font-bold text-neutral-200">
                  {idx + 1}
                </span>
                <h3 className="text-base font-semibold text-white">{m.title}</h3>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-base font-bold text-white font-mono">
                  {m.amount.toLocaleString()} USDC
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                    m.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : m.status === 'Submitted'
                      ? 'bg-indigo-500/20 text-indigo-300 animate-pulse'
                      : m.status === 'Disputed'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </div>

            {m.proofCid && (
              <div className="p-3 rounded-lg bg-background/70 border border-brand-border/60 text-xs font-mono flex items-center justify-between">
                <span className="text-neutral-400">IPFS Deliverable Proof:</span>
                <a
                  href={`https://ipfs.io/ipfs/${m.proofCid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-accent hover:underline truncate max-w-md"
                >
                  ipfs://{m.proofCid}
                </a>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-brand-border/40">
              {m.status === 'Pending' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Enter IPFS CID (Qm...)"
                    value={inputCid}
                    onChange={(e) => setInputCid(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-background border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-primary"
                  />
                  <button
                    disabled={isProcessing || !inputCid}
                    onClick={() => handleSubmitProof(idx)}
                    className="px-4 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-brand-secondary transition disabled:opacity-50"
                  >
                    Submit Proof
                  </button>
                </div>
              )}

              {m.status === 'Submitted' && (
                <>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleDispute(idx)}
                    className="px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/10 transition"
                  >
                    Raise Dispute
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleRelease(idx)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-md shadow-emerald-600/20"
                  >
                    Approve & Release Funds
                  </button>
                </>
              )}

              {m.status === 'Approved' && (
                <span className="text-xs font-mono text-neutral-400">
                  ✓ Milestone settled and disbursed to provider on-chain.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
