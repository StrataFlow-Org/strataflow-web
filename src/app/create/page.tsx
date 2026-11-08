'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../context/WalletContext';

interface MilestoneInput {
  description: string;
  amount: number;
}

export default function CreateAgreementPage() {
  const router = useRouter();
  const { address } = useWallet();

  const [title, setTitle] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [arbiterAddress, setArbiterAddress] = useState('');
  const [tokenType, setTokenType] = useState('USDC');
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { description: 'Initial Architecture & Specifications', amount: 1500 },
    { description: 'Core Smart Contract Implementation', amount: 2500 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', amount: 1000 }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/agreements');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/agreements" className="text-xs font-mono text-brand-primary hover:underline">
          ← Back to Agreements
        </Link>
        <h1 className="text-3xl font-extrabold text-white mt-2">Create Milestone Escrow</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Deploy a non-custodial Soroban agreement. Funds will be deposited securely into the contract.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface space-y-4">
          <h2 className="text-lg font-semibold text-white">1. Agreement Overview</h2>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Soroban DEX Liquidity Indexer"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-brand-border text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Provider Stellar Address
              </label>
              <input
                type="text"
                required
                value={providerAddress}
                onChange={(e) => setProviderAddress(e.target.value)}
                placeholder="G..."
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-brand-border text-white text-sm font-mono focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Designated Arbiter Address
              </label>
              <input
                type="text"
                required
                value={arbiterAddress}
                onChange={(e) => setArbiterAddress(e.target.value)}
                placeholder="G..."
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-brand-border text-white text-sm font-mono focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Settlement Currency
            </label>
            <select
              value={tokenType}
              onChange={(e) => setTokenType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-brand-border text-white text-sm focus:outline-none focus:border-brand-primary"
            >
              <option value="USDC">USDC (Circle Stellar SAC)</option>
              <option value="XLM">Native XLM</option>
            </select>
          </div>
        </div>

        {/* Milestone Schedule */}
        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">2. Milestone Schedule</h2>
            <button
              type="button"
              onClick={addMilestone}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-primary/20 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary/30 transition"
            >
              + Add Milestone
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-background border border-brand-border/60"
              >
                <span className="w-6 text-center text-xs font-mono text-neutral-400">#{idx + 1}</span>
                <input
                  type="text"
                  required
                  placeholder="Milestone deliverable description"
                  value={m.description}
                  onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded bg-transparent text-white text-sm focus:outline-none"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={m.amount}
                    onChange={(e) => updateMilestone(idx, 'amount', Number(e.target.value))}
                    className="w-28 px-3 py-1.5 rounded bg-brand-surface border border-brand-border text-white text-sm font-mono text-right focus:outline-none"
                  />
                  <span className="text-xs font-mono text-neutral-400">{tokenType}</span>
                </div>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    className="text-neutral-500 hover:text-red-400 text-sm px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-brand-border/60 flex justify-between items-center text-sm">
            <span className="text-neutral-400">Total Escrow Allocation</span>
            <span className="font-bold text-lg text-white font-mono">
              {totalAmount.toLocaleString()} {tokenType}
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/agreements"
            className="px-6 py-3 rounded-lg border border-brand-border bg-brand-surface text-neutral-300 text-sm font-medium hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !address}
            className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-secondary text-white text-sm font-medium transition shadow-md shadow-indigo-600/30 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Broadcasting to Soroban...'
              : address
              ? `Confirm & Sign Escrow (${totalAmount} ${tokenType})`
              : 'Connect Wallet to Sign'}
          </button>
        </div>
      </form>
    </div>
  );
}
