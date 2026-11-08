'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AgreementSummary {
  id: string;
  title: string;
  client: string;
  provider: string;
  amount: number;
  milestonesCount: number;
  completedMilestones: number;
  status: 'Funded' | 'Created' | 'Completed' | 'Disputed';
  deadline: string;
}

const MOCK_AGREEMENTS: AgreementSummary[] = [
  {
    id: '1',
    title: 'Soroban Indexer & Webhook Service Integration',
    client: 'GBBD...2026',
    provider: 'GCP7...COMM',
    amount: 6000,
    milestonesCount: 3,
    completedMilestones: 1,
    status: 'Funded',
    deadline: '2026-12-01',
  },
  {
    id: '2',
    title: 'Smart Contract Audit & Formal Verification',
    client: 'GAA5...KIKI',
    provider: 'GBBD...2026',
    amount: 12500,
    milestonesCount: 2,
    completedMilestones: 2,
    status: 'Completed',
    deadline: '2026-11-05',
  },
  {
    id: '3',
    title: 'Cross-Border B2B Supply Escrow Payout',
    client: 'GD99...OPHI',
    provider: 'GAZ1...TALK',
    amount: 4200,
    milestonesCount: 4,
    completedMilestones: 0,
    status: 'Created',
    deadline: '2026-12-15',
  },
];

export default function AgreementsPage() {
  const [filter, setFilter] = useState<'All' | 'Funded' | 'Completed' | 'Created'>('All');

  const filtered = filter === 'All'
    ? MOCK_AGREEMENTS
    : MOCK_AGREEMENTS.filter((a) => a.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-brand-border">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Escrow Agreements</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Monitor on-chain milestone deposits, review deliverables, and approve disbursements.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/create"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-medium hover:bg-brand-secondary transition shadow-md shadow-indigo-600/20"
          >
            + Create New Escrow
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="p-5 rounded-xl border border-brand-border bg-brand-surface">
          <span className="text-xs uppercase text-neutral-400 font-mono">Total Volume Locked</span>
          <p className="text-2xl font-bold text-white font-mono mt-2">22,700 USDC</p>
        </div>
        <div className="p-5 rounded-xl border border-brand-border bg-brand-surface">
          <span className="text-xs uppercase text-neutral-400 font-mono">Active Milestones</span>
          <p className="text-2xl font-bold text-brand-accent font-mono mt-2">5 In Progress</p>
        </div>
        <div className="p-5 rounded-xl border border-brand-border bg-brand-surface">
          <span className="text-xs uppercase text-neutral-400 font-mono">Settled Payouts</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-2">12,500 USDC</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-brand-border/60 pb-3 mb-6">
        {(['All', 'Funded', 'Completed', 'Created'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === tab
                ? 'bg-brand-primary text-white'
                : 'text-neutral-400 hover:text-white hover:bg-brand-border/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Agreements Table */}
      <div className="space-y-4">
        {filtered.map((agreement) => (
          <div
            key={agreement.id}
            className="p-6 rounded-xl border border-brand-border bg-brand-surface flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-primary/50 transition"
          >
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-brand-primary">#{agreement.id}</span>
                <h3 className="text-base font-semibold text-white">{agreement.title}</h3>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    agreement.status === 'Funded'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : agreement.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {agreement.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                Client: {agreement.client} · Provider: {agreement.provider} · Deadline: {agreement.deadline}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-base font-bold text-white font-mono">{agreement.amount.toLocaleString()} USDC</p>
                <p className="text-xs text-neutral-400">
                  {agreement.completedMilestones}/{agreement.milestonesCount} milestones approved
                </p>
              </div>
              <Link
                href={`/agreements/${agreement.id}`}
                className="px-4 py-2 rounded-lg border border-brand-border bg-background/60 text-sm font-medium text-neutral-200 hover:text-white hover:border-neutral-400 transition"
              >
                View Flow
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
