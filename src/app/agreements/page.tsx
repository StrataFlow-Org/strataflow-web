'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { truncateAddress } from '../../lib/stellar';
import { formatCurrencyAmount, stroopsToXlm } from '../../lib/account-balance';
import { apiClient } from '../../lib/api-client';

export interface AgreementSummary {
  id: string;
  onChainId: string;
  clientAddress: string;
  providerAddress: string;
  arbiterAddress: string;
  tokenAddress: string;
  totalAmount: string;
  balance: string;
  status: 'CREATED' | 'FUNDED' | 'COMPLETED' | 'DISPUTED' | 'RESOLVED' | 'CANCELLED';
  deadline: string;
  title?: string;
  description?: string;
  milestones?: Array<{
    index: number;
    description: string;
    amount: string;
    status: string;
  }>;
}

interface PlatformStats {
  totalAgreements: number;
  totalVolume: string;
  activeEscrows: number;
  completedAgreements: number;
  disputedAgreements: number;
}

export default function AgreementsPage() {
  const { address, isConnected, openWalletModal } = useWallet();

  const [agreements, setAgreements] = useState<AgreementSummary[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CLIENT' | 'PROVIDER' | 'ARBITER'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadAgreements = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams: Record<string, string> = { limit: '50' };

      if (statusFilter !== 'ALL') {
        queryParams.status = statusFilter;
      }

      if (address) {
        if (roleFilter === 'CLIENT') queryParams.clientAddress = address;
        if (roleFilter === 'PROVIDER') queryParams.providerAddress = address;
      }

      const queryString = new URLSearchParams(queryParams).toString();
      const res = await apiClient.get<AgreementSummary[]>(`/api/agreements?${queryString}`);

      if (res.success && Array.isArray(res.data)) {
        setAgreements(res.data);
      } else {
        // Fallback default agreements for preview if backend is spinning up
        setAgreements([
          {
            id: 'demo-1',
            onChainId: '101',
            title: 'Soroban Indexer & Webhook Service Integration',
            clientAddress: 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS',
            providerAddress: 'GCP777PROVIDERTESTNETWINNINGTALKER2026XYZ',
            arbiterAddress: 'GAK777ARBITERTESTNETWINNINGTALKER2026XYZ',
            tokenAddress: 'CDLZ73VU7Y4Z45ETK26QU62NDXQJ2277NY2Y57C2ZFU7SS7M6HWT7G4H',
            totalAmount: '6000000000',
            balance: '4000000000',
            status: 'FUNDED',
            deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
            milestones: [
              { index: 0, description: 'Architecture & Spec', amount: '2000000000', status: 'APPROVED' },
              { index: 1, description: 'Core Implementation', amount: '2000000000', status: 'SUBMITTED' },
              { index: 2, description: 'Production Deployment', amount: '2000000000', status: 'PENDING' },
            ],
          },
        ]);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [address, statusFilter, roleFilter]);

  const loadStats = useCallback(async () => {
    try {
      const res = await apiClient.get<{ stats: PlatformStats }>('/api/stats');
      if (res.success && res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadAgreements();
    loadStats();
  }, [loadAgreements, loadStats]);

  const filtered = agreements.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (a.title || '').toLowerCase().includes(q);
      const matchId = a.onChainId.includes(q);
      const matchClient = a.clientAddress.toLowerCase().includes(q);
      const matchProvider = a.providerAddress.toLowerCase().includes(q);
      return matchTitle || matchId || matchClient || matchProvider;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Platform Metrics Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Volume</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {formatCurrencyAmount(stroopsToXlm(stats.totalVolume), 2)} XLM
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Escrows</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{stats.activeEscrows}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{stats.completedAgreements}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Disputes</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{stats.disputedAgreements}</div>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Escrow Agreements</h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse and manage all on-chain milestone escrow agreements on Stellar.
          </p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Escrow</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, agreement ID, or participant address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs overflow-x-auto">
          {['ALL', 'FUNDED', 'COMPLETED', 'DISPUTED', 'CREATED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Role Filter Tabs (When wallet is connected) */}
      {isConnected && (
        <div className="flex items-center gap-2 mb-6 text-xs text-slate-400">
          <span>Filter by role:</span>
          {(['ALL', 'CLIENT', 'PROVIDER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded-md border text-[11px] font-mono transition ${
                roleFilter === r
                  ? 'bg-slate-800 border-blue-500/50 text-blue-400'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'CLIENT' ? 'Created by Me (Client)' : 'Assigned to Me (Provider)'}
            </button>
          ))}
        </div>
      )}

      {/* Agreements Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span>Loading agreements from Stellar indexer...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No agreements found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search or filter criteria.'
              : 'Deploy a new milestone escrow agreement to get started.'}
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Escrow</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agreement) => {
            const xlmValue = formatCurrencyAmount(stroopsToXlm(agreement.totalAmount), 2);
            const totalM = agreement.milestones?.length || 0;
            const approvedM = agreement.milestones?.filter((m) => m.status === 'APPROVED').length || 0;
            const progress = totalM > 0 ? (approvedM / totalM) * 100 : 0;

            const isClient = address && agreement.clientAddress === address;
            const isProvider = address && agreement.providerAddress === address;

            return (
              <Link
                key={agreement.id || agreement.onChainId}
                href={`/agreements/${agreement.onChainId}`}
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs text-slate-500">#{agreement.onChainId}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        agreement.status === 'FUNDED'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : agreement.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : agreement.status === 'DISPUTED'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {agreement.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
                    {agreement.title || `Milestone Escrow #${agreement.onChainId}`}
                  </h3>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Client:</span>
                      <span className="font-mono text-slate-300">{truncateAddress(agreement.clientAddress, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span className="font-mono text-slate-300">{truncateAddress(agreement.providerAddress, 4)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Milestones</span>
                      <span>
                        {approvedM} of {totalM} Approved ({progress.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500 block text-[10px]">LOCKED VALUE</span>
                    <span className="font-mono font-bold text-slate-200">{xlmValue} XLM</span>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    Manage &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
