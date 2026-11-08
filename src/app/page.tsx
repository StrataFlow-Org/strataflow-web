import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
  CheckCircle,
  FileCode,
  Share2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Stellar Drips Wave Participant &bull; Soroban v21 Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Trustless Escrows for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">High-Value Delivery</span> on Stellar
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
          Eliminate counterparty risk in freelance contracts, cross-border commerce, and grant funding.
          Lock funds into Soroban smart contracts, verify milestone deliverables with cryptographic proofs, and release payments in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Create New Escrow</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/agreements"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <span>Explore Agreements</span>
          </Link>
        </div>
      </div>

      {/* Protocol Workflow Diagram */}
      <div className="max-w-4xl mx-auto mb-20 p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white">How StrataFlow Works on Stellar</h2>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic state machine with automated escrow settlement and impartial arbitration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <h4 className="font-bold text-sm text-white">Deposit & Lock</h4>
            <p className="text-xs text-slate-400 mt-1">
              Client deploys agreement and locks XLM or SAC tokens into Soroban contract.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <h4 className="font-bold text-sm text-white">Deliver Work</h4>
            <p className="text-xs text-slate-400 mt-1">
              Provider delivers milestone and broadcasts immutable IPFS verification proof.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <h4 className="font-bold text-sm text-white">Release Payout</h4>
            <p className="text-xs text-slate-400 mt-1">
              Client inspects deliverable and signs milestone approval transaction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              4
            </div>
            <h4 className="font-bold text-sm text-white">Protection</h4>
            <p className="text-xs text-slate-400 mt-1">
              Timeout refunds protect clients; designated arbiters resolve disputes fairly.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Soroban Native Speed</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Near-zero transaction fees ($0.00001) and sub-5-second finality powered by the Stellar consensus protocol.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Non-Custodial & Safe</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            StrataFlow never touches private keys. Funds are held in decentralized Soroban contract storage with circuit-breaker protection.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-blue-500/40 transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Stellar Asset Contract (SAC)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Supports Native XLM Lumens, Circle USDC, and any custom Stellar SAC token asset seamlessly.
          </p>
        </div>
      </div>

      {/* Stellar Ecosystem Alignment Section */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 max-w-5xl mx-auto mb-20">
        <h3 className="text-lg font-bold text-white mb-2">Stellar Ecosystem Native Architecture</h3>
        <p className="text-xs text-slate-300 mb-6">
          StrataFlow is purposefully engineered from the ground up for the Stellar and Soroban network:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-blue-400 block font-bold mb-1">SEP-10</span>
            <span className="text-slate-400 text-[11px]">WebAuth challenge cryptographic verification</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-blue-400 block font-bold mb-1">Soroban v21</span>
            <span className="text-slate-400 text-[11px]">Persistent storage TTL extension & events</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-blue-400 block font-bold mb-1">Freighter API</span>
            <span className="text-slate-400 text-[11px]">Native wallet signing & network verification</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-blue-400 block font-bold mb-1">SAC Tokens</span>
            <span className="text-slate-400 text-[11px]">Native XLM and Circle USDC escrow support</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-12 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} StrataFlow Protocol. Built for Stellar Drips Wave.
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://developers.stellar.org"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-400 transition"
          >
            Stellar Docs
          </a>
          <a
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-400 transition"
          >
            Stellar Expert
          </a>
          <a
            href="https://github.com/StrataFlow-Org"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-400 transition"
          >
            GitHub Polyrepo
          </a>
        </div>
      </footer>
    </div>
  );
}
