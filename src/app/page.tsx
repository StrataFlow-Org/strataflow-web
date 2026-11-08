import React from "react";
import MilestoneTracker from "../components/MilestoneTracker";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4">
          Stellar Drips Wave Participant
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Trustless Escrows for High-Value Delivery on Stellar
        </h1>
        <p className="text-lg text-neutral-400">
          Eliminate counterparty risk. Lock funds into Soroban smart contracts,
          verify deliverables with cryptographic proof, and release milestone
          payouts in seconds.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-brand-primary hover:bg-brand-secondary text-white font-medium shadow-lg shadow-indigo-500/25 transition">
            Create New Escrow
          </button>
          <a
            href="https://github.com/winningtalker-commits/strataflow-contracts"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-lg border border-brand-border bg-brand-surface text-neutral-200 hover:text-white hover:border-neutral-500 transition"
          >
            Inspect Contracts
          </a>
        </div>
      </div>

      {/* Interactive Tracker Preview */}
      <div className="max-w-4xl mx-auto">
        <MilestoneTracker />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface/60">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">
            ⚡
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Soroban Native Speed
          </h3>
          <p className="text-sm text-neutral-400">
            Near-zero gas fees and 3-5 second transaction finality powered by
            the Stellar consensus mechanism.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface/60">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold mb-4">
            🔒
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Non-Custodial Multi-Token
          </h3>
          <p className="text-sm text-neutral-400">
            Supports native XLM and any Stellar Asset Contract (SAC) token,
            including Circle USDC.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-brand-border bg-brand-surface/60">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-4">
            ⚖️
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Pluggable Arbitration
          </h3>
          <p className="text-sm text-neutral-400">
            Designate trusted third-party arbiters or multi-sig panels to
            resolve disagreements on-chain.
          </p>
        </div>
      </div>
    </div>
  );
}
