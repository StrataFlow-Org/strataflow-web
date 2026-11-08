import React from 'react';

interface MilestoneItem {
  id: number;
  title: string;
  amount: number;
  status: 'Approved' | 'Submitted' | 'Pending' | 'Disputed';
  proofCid?: string;
}

const DEMO_MILESTONES: MilestoneItem[] = [
  {
    id: 1,
    title: 'Phase 1: Architecture Blueprint & Soroban Interface Specs',
    amount: 1500,
    status: 'Approved',
    proofCid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
  },
  {
    id: 2,
    title: 'Phase 2: Contract Implementation & Testnet Deployment',
    amount: 2500,
    status: 'Submitted',
    proofCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
  },
  {
    id: 3,
    title: 'Phase 3: Integration Testing & Mainnet Audit Handover',
    amount: 2000,
    status: 'Pending',
  },
];

export default function MilestoneTracker() {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-brand-border/60">
        <div>
          <h3 className="text-lg font-semibold text-white">Active Milestone Flow</h3>
          <p className="text-xs text-neutral-400">Agreement #001 · Contract Balance: 4,500 USDC</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Escrow Funded
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {DEMO_MILESTONES.map((m, idx) => (
          <div
            key={m.id}
            className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-brand-border/80 hover:border-brand-primary/40 transition"
          >
            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-brand-border flex items-center justify-center text-xs font-mono text-neutral-300">
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-medium text-white">{m.title}</h4>
                {m.proofCid && (
                  <p className="text-xs font-mono text-brand-accent mt-0.5">
                    Proof: {m.proofCid.substring(0, 16)}...
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-white font-mono">
                {m.amount.toLocaleString()} USDC
              </span>

              {m.status === 'Approved' && (
                <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-400 font-medium">
                  Released
                </span>
              )}
              {m.status === 'Submitted' && (
                <span className="px-2 py-0.5 text-xs rounded bg-indigo-500/20 text-indigo-300 font-medium animate-pulse">
                  Ready for Review
                </span>
              )}
              {m.status === 'Pending' && (
                <span className="px-2 py-0.5 text-xs rounded bg-neutral-800 text-neutral-400 font-medium">
                  Locked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
