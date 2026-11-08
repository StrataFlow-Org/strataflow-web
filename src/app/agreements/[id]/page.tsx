'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Coins,
  Send,
  ExternalLink,
  Loader2,
  FileText,
  UserCheck,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { useWallet } from '../../../context/WalletContext';
import { truncateAddress } from '../../../lib/stellar';
import { formatCurrencyAmount, stroopsToXlm, xlmToStroops } from '../../../lib/account-balance';
import { SorobanTxPipeline, sorobanPipeline } from '../../../lib/soroban-tx';
import { STELLAR_CONFIG } from '../../../lib/stellar';
import { getExplorerTxUrl, getExplorerAccountUrl } from '../../../lib/stellar-network';
import { apiClient } from '../../../lib/api-client';

interface MilestoneDetail {
  index: number;
  description: string;
  amount: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'DISPUTED';
  proofHash?: string;
  submittedAt?: string;
  approvedAt?: string;
}

interface AgreementDetail {
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
  milestones: MilestoneDetail[];
  events?: Array<{
    type: string;
    ledger: number;
    txHash: string;
    timestamp: string;
  }>;
}

export default function AgreementDetailPage() {
  const params = useParams();
  const onChainId = (params?.id as string) || '1';
  const { address, isConnected, signTransaction, openWalletModal, network } = useWallet();

  const [agreement, setAgreement] = useState<AgreementDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'MILESTONES' | 'TIMELINE' | 'ARBITRATION'>('MILESTONES');

  // Action states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  // Submit proof modal state
  const [submittingMilestoneIndex, setSubmittingMilestoneIndex] = useState<number | null>(null);
  const [proofInput, setProofInput] = useState<string>('');

  // Dispute resolution sliders
  const [disputeClientShare, setDisputeClientShare] = useState<number>(50);

  const fetchAgreement = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await apiClient.get<AgreementDetail>(`/api/agreements/${onChainId}`);

      if (res.success && res.data) {
        setAgreement(res.data);
      } else {
        // Fallback default for preview
        setAgreement({
          id: `preview-${onChainId}`,
          onChainId,
          clientAddress: 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS',
          providerAddress: 'GCP777PROVIDERTESTNETWINNINGTALKER2026XYZ',
          arbiterAddress: 'GAK777ARBITERTESTNETWINNINGTALKER2026XYZ',
          tokenAddress: 'CDLZ73VU7Y4Z45ETK26QU62NDXQJ2277NY2Y57C2ZFU7SS7M6HWT7G4H',
          totalAmount: '6000000000',
          balance: '4000000000',
          status: 'FUNDED',
          deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
          title: 'Soroban Indexer & Webhook Service Integration',
          description: 'Production-ready milestone escrow with on-chain event stream and automated notifications.',
          milestones: [
            {
              index: 0,
              description: 'Phase 1: Architecture Blueprint & Soroban Interface Specs',
              amount: '2000000000',
              status: 'APPROVED',
              proofHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
              submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
              approvedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
              index: 1,
              description: 'Phase 2: Contract Implementation & Testnet Deployment',
              amount: '2000000000',
              status: 'SUBMITTED',
              proofHash: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
              submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
            },
            {
              index: 2,
              description: 'Phase 3: Integration Testing & Mainnet Audit Handover',
              amount: '2000000000',
              status: 'PENDING',
            },
          ],
          events: [
            {
              type: 'MilestoneSubmitted',
              ledger: 541092,
              txHash: 'e42ba5566fbc2646d2a7c41e8c105cb83015bbf099411d331923055f5f72cf7e',
              timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
            },
            {
              type: 'MilestoneApproved',
              ledger: 539201,
              txHash: 'd9fba457a412b591b6bc420f12a95c38982f1b4a03498b894175399589a805fa',
              timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
              type: 'AgreementFunded',
              ledger: 538110,
              txHash: '2f50dde11504cf10a82643a6d71b80a71be70b43171350a417088b90c1e8e54e',
              timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
            },
          ],
        });
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [onChainId]);

  useEffect(() => {
    fetchAgreement();
  }, [fetchAgreement]);

  // Roles determination
  const isClient = !!address && agreement?.clientAddress === address;
  const isProvider = !!address && agreement?.providerAddress === address;
  const isArbiter = !!address && agreement?.arbiterAddress === address;

  // On-chain action dispatcher helper
  const executeContractCall = async (method: string, args: any[]) => {
    if (!address) {
      openWalletModal();
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessTxHash(null);
    setActionMessage(`Simulating ${method} on Soroban...`);

    try {
      const sim = await sorobanPipeline.simulateTransaction(
        address,
        STELLAR_CONFIG.contractId,
        method,
        args
      );

      if (!sim.isSuccess || !sim.assembledTransaction) {
        throw new Error(sim.error || `Simulation for ${method} failed`);
      }

      setActionMessage('Requesting wallet signature in Freighter...');
      const signedXdr = await signTransaction(sim.assembledTransaction.toXDR());

      setActionMessage('Submitting transaction to Stellar network...');
      const result = await sorobanPipeline.submitAndPoll(signedXdr);

      if (result.status !== 'SUCCESS') {
        throw new Error(result.error || `Failed to finalize ${method} on-chain`);
      }

      setSuccessTxHash(result.hash);
      setActionMessage('');
      // Refresh agreement details
      await fetchAgreement();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
      setActionMessage('');
    }
  };

  // 1. Fund Agreement
  const handleFundAgreement = async () => {
    if (!agreement) return;
    const args = SorobanTxPipeline.buildFundAgreementArgs(onChainId, agreement.totalAmount);
    await executeContractCall('fund_agreement', args);
  };

  // 2. Submit Milestone Proof (Provider only)
  const handleSubmitMilestoneProof = async () => {
    if (submittingMilestoneIndex === null || !proofInput.trim()) return;
    const args = SorobanTxPipeline.buildSubmitMilestoneArgs(
      onChainId,
      submittingMilestoneIndex,
      proofInput.trim()
    );
    await executeContractCall('submit_milestone', args);
    setSubmittingMilestoneIndex(null);
    setProofInput('');
  };

  // 3. Release Milestone (Client only)
  const handleReleaseMilestone = async (milestoneIndex: number) => {
    const args = SorobanTxPipeline.buildReleaseMilestoneArgs(onChainId, milestoneIndex);
    await executeContractCall('release_milestone', args);
  };

  // 4. Raise Dispute (Client or Provider)
  const handleRaiseDispute = async () => {
    const confirm = window.confirm(
      'Are you sure you want to raise a dispute? This will freeze escrow funds until the arbiter rules.'
    );
    if (!confirm) return;
    const args = SorobanTxPipeline.buildRaiseDisputeArgs(onChainId);
    await executeContractCall('raise_dispute', args);
  };

  // 5. Resolve Dispute (Arbiter only)
  const handleResolveDispute = async () => {
    if (!agreement) return;
    const totalBal = BigInt(agreement.balance);
    const clientAmount = (totalBal * BigInt(disputeClientShare)) / 100n;
    const providerAmount = totalBal - clientAmount;

    const args = SorobanTxPipeline.buildResolveDisputeArgs(onChainId, clientAmount, providerAmount);
    await executeContractCall('resolve_dispute', args);
  };

  // 6. Claim Timeout Refund
  const handleClaimTimeoutRefund = async () => {
    const args = SorobanTxPipeline.buildClaimTimeoutRefundArgs(onChainId);
    await executeContractCall('claim_timeout_refund', args);
  };

  // 7. Cancel Agreement (Client only, unfunded)
  const handleCancelAgreement = async () => {
    const confirm = window.confirm('Cancel this unfunded escrow draft?');
    if (!confirm) return;
    const args = SorobanTxPipeline.buildCancelAgreementArgs(onChainId);
    await executeContractCall('cancel_agreement', args);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        <span>Loading agreement details from Soroban...</span>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Agreement Not Found</h2>
        <Link href="/agreements" className="text-blue-400 hover:underline mt-4 inline-block text-sm">
          &larr; Return to Agreements Directory
        </Link>
      </div>
    );
  }

  const isExpired = new Date(agreement.deadline).getTime() < Date.now();
  const totalValue = formatCurrencyAmount(stroopsToXlm(agreement.totalAmount), 2);
  const remainingValue = formatCurrencyAmount(stroopsToXlm(agreement.balance), 2);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigation & Header */}
      <div className="mb-6">
        <Link href="/agreements" className="text-xs font-mono text-blue-400 hover:underline">
          &larr; Back to Agreements Directory
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {agreement.title || `Milestone Escrow #${agreement.onChainId}`}
              </h1>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
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
            <p className="text-xs text-slate-400 mt-1 font-mono">
              On-Chain Contract Agreement ID: #{agreement.onChainId}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAgreement}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
              title="Refresh state"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {agreement.status === 'CREATED' && isClient && (
              <button
                onClick={handleFundAgreement}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
              >
                <Coins className="w-4 h-4" />
                <span>Fund Escrow ({totalValue} XLM)</span>
              </button>
            )}
            {agreement.status === 'CREATED' && isClient && (
              <button
                onClick={handleCancelAgreement}
                disabled={isProcessing}
                className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition"
              >
                Cancel Draft
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successTxHash && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Transaction executed and confirmed on Stellar!</span>
          </div>
          <a
            href={getExplorerTxUrl(successTxHash, network)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-mono text-xs text-emerald-400 underline"
          >
            <span>View Tx</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong>Transaction Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Action Progress Indicator */}
      {actionMessage && (
        <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Total Value</span>
          <div className="text-xl font-bold font-mono text-white mt-1">{totalValue} XLM</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Remaining Balance</span>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">{remainingValue} XLM</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Deadline</span>
          <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(agreement.deadline).toLocaleDateString()}</span>
            {isExpired && <span className="text-[10px] text-rose-400 font-bold uppercase">(Expired)</span>}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Your Role</span>
          <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {isClient ? 'Client (Buyer)' : isProvider ? 'Provider (Seller)' : isArbiter ? 'Arbiter' : 'Observer'}
            </span>
          </div>
        </div>
      </div>

      {/* Participants Detail Card */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Escrow Participants</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[11px] mb-1">CLIENT ADDRESS:</span>
            <a
              href={getExplorerAccountUrl(agreement.clientAddress, network)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1 truncate"
            >
              <span>{truncateAddress(agreement.clientAddress, 6)}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px] mb-1">PROVIDER ADDRESS:</span>
            <a
              href={getExplorerAccountUrl(agreement.providerAddress, network)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1 truncate"
            >
              <span>{truncateAddress(agreement.providerAddress, 6)}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px] mb-1">ARBITER ADDRESS:</span>
            <a
              href={getExplorerAccountUrl(agreement.arbiterAddress, network)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1 truncate"
            >
              <span>{truncateAddress(agreement.arbiterAddress, 6)}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 mb-6 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('MILESTONES')}
          className={`pb-3 transition relative ${
            activeTab === 'MILESTONES' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Milestone Deliverables ({agreement.milestones.length})
        </button>

        <button
          onClick={() => setActiveTab('TIMELINE')}
          className={`pb-3 transition relative ${
            activeTab === 'TIMELINE' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          On-Chain Event Stream
        </button>

        {(isArbiter || agreement.status === 'DISPUTED') && (
          <button
            onClick={() => setActiveTab('ARBITRATION')}
            className={`pb-3 transition relative flex items-center gap-1.5 ${
              activeTab === 'ARBITRATION'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Dispute & Arbitration</span>
          </button>
        )}
      </div>

      {/* TAB 1: MILESTONES */}
      {activeTab === 'MILESTONES' && (
        <div className="space-y-4">
          {agreement.milestones.map((m, idx) => {
            const mAmount = formatCurrencyAmount(stroopsToXlm(m.amount), 2);
            const canSubmit = isProvider && agreement.status === 'FUNDED' && m.status === 'PENDING';
            const canApprove = isClient && agreement.status === 'FUNDED' && m.status === 'SUBMITTED';

            return (
              <div
                key={m.index}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      m.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : m.status === 'SUBMITTED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-100">{m.description}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          m.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : m.status === 'SUBMITTED'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>
                        Amount: <strong className="font-mono text-slate-200">{mAmount} XLM</strong>
                      </span>

                      {m.proofHash && (
                        <a
                          href={`https://ipfs.io/ipfs/${m.proofHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:underline font-mono"
                        >
                          <span>Deliverable Proof: {truncateAddress(m.proofHash, 6)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Milestone Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  {canSubmit && (
                    <button
                      onClick={() => setSubmittingMilestoneIndex(m.index)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Proof</span>
                    </button>
                  )}

                  {canApprove && (
                    <button
                      onClick={() => handleReleaseMilestone(m.index)}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Release Funds</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Emergency / Dispute Bar */}
          {agreement.status === 'FUNDED' && (
            <div className="mt-8 p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Need mediation? You can raise a formal dispute for arbiter review.</span>
              </div>
              {(isClient || isProvider) && (
                <button
                  onClick={handleRaiseDispute}
                  className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-semibold transition"
                >
                  Raise Dispute
                </button>
              )}
            </div>
          )}

          {/* Timeout Refund Claim Bar */}
          {isExpired && agreement.status === 'FUNDED' && isClient && (
            <div className="mt-4 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between text-xs text-rose-300">
              <div>
                <strong>Agreement Deadline Expired:</strong> You are eligible to claim a full refund of unreleased
                escrow funds.
              </div>
              <button
                onClick={handleClaimTimeoutRefund}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-500 transition"
              >
                Claim Timeout Refund
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Chronological Contract Events</h3>
          <div className="space-y-4">
            {agreement.events && agreement.events.length > 0 ? (
              agreement.events.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs border-l-2 border-blue-500 pl-4 py-1">
                  <div>
                    <div className="font-bold text-slate-200">{evt.type}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Ledger #{evt.ledger} &bull; {new Date(evt.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <a
                    href={getExplorerTxUrl(evt.txHash, network)}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto font-mono text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Tx: {truncateAddress(evt.txHash, 4)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No events indexed yet for this agreement.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ARBITRATION */}
      {activeTab === 'ARBITRATION' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4 text-amber-400 font-bold">
            <Scale className="w-5 h-5" />
            <h3 className="text-base text-white">Arbiter Resolution Console</h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            As the designated impartial arbiter, you have the authority to split the remaining escrow balance between
            client and provider.
          </p>

          <div className="space-y-4 max-w-lg">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-blue-400">Client Refund: {disputeClientShare}%</span>
                <span className="text-emerald-400">Provider Payout: {100 - disputeClientShare}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={disputeClientShare}
                onChange={(e) => setDisputeClientShare(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Client Amount:</span>
                <span className="text-slate-100 font-bold">
                  {formatCurrencyAmount(
                    stroopsToXlm((BigInt(agreement.balance) * BigInt(disputeClientShare)) / 100n),
                    2
                  )}{' '}
                  XLM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider Amount:</span>
                <span className="text-slate-100 font-bold">
                  {formatCurrencyAmount(
                    stroopsToXlm((BigInt(agreement.balance) * BigInt(100 - disputeClientShare)) / 100n),
                    2
                  )}{' '}
                  XLM
                </span>
              </div>
            </div>

            {isArbiter ? (
              <button
                onClick={handleResolveDispute}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition"
              >
                Finalize Binding Dispute Settlement
              </button>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Only the designated arbiter ({truncateAddress(agreement.arbiterAddress, 4)}) can execute dispute settlements.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Submit Milestone Proof Modal */}
      {submittingMilestoneIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold">Submit Milestone Deliverable</h3>
            <p className="text-xs text-slate-400 mt-1">
              Provide an IPFS CID, GitHub release hash, or document fingerprint verifying deliverable completion.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Proof Hash / IPFS CID
              </label>
              <input
                type="text"
                value={proofInput}
                onChange={(e) => setProofInput(e.target.value.trim())}
                placeholder="bafybeig... or Qm..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSubmittingMilestoneIndex(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitMilestoneProof}
                disabled={!proofInput.trim() || isProcessing}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition"
              >
                Broadcast Deliverable Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
