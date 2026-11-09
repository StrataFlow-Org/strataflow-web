'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Plus,
  Trash2,
  Calendar,
  Wallet,
  Coins,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import { isValidStellarAddress, isValidContractAddress } from '../../lib/stellar';
import { SUPPORTED_TOKENS, getTokenConfig } from '../../lib/tokens';
import { xlmToStroops, formatCurrencyAmount } from '../../lib/account-balance';
import { SorobanTxPipeline, sorobanPipeline } from '../../lib/soroban-tx';
import { STELLAR_CONFIG } from '../../lib/stellar';
import { getExplorerTxUrl } from '../../lib/stellar-network';
import { apiClient } from '../../lib/api-client';

interface MilestoneInput {
  description: string;
  amount: number | string;
}

export default function CreateAgreementPage() {
  const router = useRouter();
  const { address, isConnected, signTransaction, openWalletModal, network } = useWallet();
  const { showSuccess, showError, showTransaction } = useToast();

  // Wizard Step: 1 = Details, 2 = Milestones, 3 = Review & Execute
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [arbiterAddress, setArbiterAddress] = useState('');
  const [tokenKey, setTokenKey] = useState<string>('USDC');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [durationDays, setDurationDays] = useState<number>(30);
  const [fundImmediately, setFundImmediately] = useState<boolean>(true);

  // Milestones State
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { description: 'Milestone 1: Architecture, Smart Contract Spec & Wireframes', amount: '500' },
    { description: 'Milestone 2: Protocol Implementation & Core Delivery', amount: '1000' },
  ]);

  // Submission & Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [simulationFee, setSimulationFee] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  // Total budget calculation
  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount.toString()) || 0), 0);

  // Local storage auto-restore draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem('strataflow_draft_escrow');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.providerAddress) setProviderAddress(parsed.providerAddress);
        if (parsed.arbiterAddress) setArbiterAddress(parsed.arbiterAddress);
        if (parsed.milestones?.length) setMilestones(parsed.milestones);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveDraft = () => {
    try {
      localStorage.setItem(
        'strataflow_draft_escrow',
        JSON.stringify({ title, providerAddress, arbiterAddress, milestones })
      );
    } catch {
      // ignore
    }
  };

  const addMilestone = () => {
    if (milestones.length >= 25) {
      alert('Maximum of 25 milestones allowed per escrow agreement.');
      return;
    }
    setMilestones([...milestones, { description: '', amount: '500' }]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  // Field validation
  const isDetailsValid =
    title.trim().length >= 3 &&
    isValidStellarAddress(providerAddress) &&
    isValidStellarAddress(arbiterAddress) &&
    providerAddress !== address &&
    arbiterAddress !== address &&
    arbiterAddress !== providerAddress;

  const isMilestonesValid =
    milestones.length > 0 &&
    milestones.every((m) => m.description.trim().length >= 3 && parseFloat(m.amount.toString()) > 0);

  // Handle dry-run simulation
  const handleProceedToSimulation = async () => {
    if (!address) {
      openWalletModal();
      return;
    }

    setErrorMessage(null);
    setIsSimulating(true);
    setStatusMessage('Simulating transaction on Soroban testnet...');

    try {
      saveDraft();
      const tokenConfig = getTokenConfig(tokenKey === 'CUSTOM' ? customTokenAddress : tokenKey);
      const tokenContract = tokenConfig.contractId;

      if (!tokenContract || !isValidContractAddress(tokenContract)) {
        throw new Error('Please specify a valid Soroban SAC token contract address');
      }

      const totalStroops = xlmToStroops(totalAmount);
      const deadlineSec = Math.floor(Date.now() / 1000) + durationDays * 86400;

      const args = SorobanTxPipeline.buildCreateAgreementArgs({
        client: address,
        provider: providerAddress,
        arbiter: arbiterAddress,
        token: tokenContract,
        totalAmount: totalStroops,
        deadline: deadlineSec,
        milestoneDescriptions: milestones.map((m) => m.description),
        milestoneAmounts: milestones.map((m) => xlmToStroops(m.amount)),
      });

      const sim = await sorobanPipeline.simulateTransaction(
        address,
        STELLAR_CONFIG.contractId,
        'create_agreement',
        args
      );

      if (!sim.isSuccess) {
        throw new Error(sim.error || 'Contract simulation failed');
      }

      setSimulationFee(sim.minResourceFee ? `${sim.minResourceFee} stroops` : '0.005 XLM');
      setStep(3);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Simulation failed';
      setErrorMessage(msg);
    } finally {
      setIsSimulating(false);
      setStatusMessage('');
    }
  };

  // Handle final submission & signing
  const handleFinalSubmit = async () => {
    if (!address) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage('Preparing IPFS agreement metadata...');

    try {
      // 1. Back up metadata to backend / IPFS
      await apiClient.post('/api/metadata', {
        title,
        description,
        milestoneDescriptions: milestones.map((m) => m.description),
      });

      // 2. Build and simulate transaction
      setStatusMessage('Requesting wallet signature in Freighter...');
      const tokenConfig = getTokenConfig(tokenKey === 'CUSTOM' ? customTokenAddress : tokenKey);
      const totalStroops = xlmToStroops(totalAmount);
      const deadlineSec = Math.floor(Date.now() / 1000) + durationDays * 86400;

      const args = SorobanTxPipeline.buildCreateAgreementArgs({
        client: address,
        provider: providerAddress,
        arbiter: arbiterAddress,
        token: tokenConfig.contractId,
        totalAmount: totalStroops,
        deadline: deadlineSec,
        milestoneDescriptions: milestones.map((m) => m.description),
        milestoneAmounts: milestones.map((m) => xlmToStroops(m.amount)),
      });

      const sim = await sorobanPipeline.simulateTransaction(
        address,
        STELLAR_CONFIG.contractId,
        'create_agreement',
        args
      );

      if (!sim.isSuccess || !sim.assembledTransaction) {
        throw new Error(sim.error || 'Failed to assemble Soroban transaction');
      }

      // 3. User signs transaction via Freighter
      const rawXdr = sim.assembledTransaction.toXDR();
      const signedXdr = await signTransaction(rawXdr);

      // 4. Submit to Soroban RPC
      setStatusMessage('Broadcasting signed transaction to Stellar network...');
      const result = await sorobanPipeline.submitAndPoll(signedXdr);

      if (result.status !== 'SUCCESS') {
        throw new Error(result.error || 'Transaction execution failed on-chain');
      }

      setSuccessTxHash(result.hash);
      showTransaction('Escrow Deployed Successfully', result.hash);
      localStorage.removeItem('strataflow_draft_escrow');
      setStatusMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transaction submission failed';
      setErrorMessage(msg);
      showError('Failed to Deploy Escrow', msg);
    } finally {
      setIsSubmitting(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/agreements" className="text-xs font-mono text-blue-400 hover:underline">
          &larr; Back to Agreements
        </Link>
        <h1 className="text-3xl font-extrabold text-white mt-2">Deploy Milestone Escrow</h1>
        <p className="text-slate-400 text-sm mt-1">
          Non-custodial milestone-gated escrow powered by Soroban smart contracts on Stellar.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            1
          </div>
          <span className={`text-sm font-medium ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>
            Participants & Terms
          </span>
        </div>
        <div className="h-0.5 w-12 bg-slate-800" />
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            2
          </div>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>
            Milestones Breakdown
          </span>
        </div>
        <div className="h-0.5 w-12 bg-slate-800" />
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            3
          </div>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-white' : 'text-slate-500'}`}>
            Simulate & Sign
          </span>
        </div>
      </div>

      {/* Success Notification Modal / Screen */}
      {successTxHash && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center animate-in fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Escrow Deployed On-Chain!</h2>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
            Your agreement smart contract invocation was successfully finalized on Stellar.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a
              href={getExplorerTxUrl(successTxHash, network)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-700 text-sm font-mono"
            >
              <span>View on Stellar Expert</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => router.push('/agreements')}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
            >
              View In Agreement Console
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong>Transaction Error:</strong> {errorMessage}
          </div>
        </div>
      )}

      {!successTxHash && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          {/* STEP 1: PARTICIPANTS & TERMS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Agreement Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Web3 DApp Development"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Description & Scope
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Summarize deliverables, acceptance criteria, and agreement terms..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Service Provider (Contractor) Address
                  </label>
                  <input
                    type="text"
                    value={providerAddress}
                    onChange={(e) => setProviderAddress(e.target.value.trim())}
                    placeholder="G..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono"
                  />
                  {providerAddress && !isValidStellarAddress(providerAddress) && (
                    <p className="text-xs text-rose-400 mt-1">Invalid Stellar public key format</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Arbiter (Dispute Resolver) Address
                  </label>
                  <input
                    type="text"
                    value={arbiterAddress}
                    onChange={(e) => setArbiterAddress(e.target.value.trim())}
                    placeholder="G..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono"
                  />
                  {arbiterAddress && !isValidStellarAddress(arbiterAddress) && (
                    <p className="text-xs text-rose-400 mt-1">Invalid Stellar public key format</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Escrow Token Asset
                  </label>
                  <select
                    value={tokenKey}
                    onChange={(e) => setTokenKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value="USDC">Circle USDC (SAC Testnet)</option>
                    <option value="XLM">Native Lumens (SAC Testnet)</option>
                    <option value="CUSTOM">Custom SAC Token Address</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Deadline Period
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days (Recommended)</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days</option>
                  </select>
                </div>
              </div>

              {tokenKey === 'CUSTOM' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Custom Soroban Token Contract ID
                  </label>
                  <input
                    type="text"
                    value={customTokenAddress}
                    onChange={(e) => setCustomTokenAddress(e.target.value.trim())}
                    placeholder="C..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!isDetailsValid}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition"
                >
                  <span>Continue to Milestones</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MILESTONES BREAKDOWN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Milestone Configuration</h3>
                  <p className="text-xs text-slate-400">
                    Funds unlock sequentially upon explicit client approval of each milestone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-4">
                {milestones.map((m, idx) => {
                  const percent = totalAmount > 0 ? ((parseFloat(m.amount.toString()) || 0) / totalAmount) * 100 : 0;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row gap-4 items-start md:items-center"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>

                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          value={m.description}
                          onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                          placeholder={`Milestone #${idx + 1} Deliverable description...`}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-36">
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={m.amount}
                            onChange={(e) => updateMilestone(idx, 'amount', e.target.value)}
                            placeholder="Amount"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono pr-12 focus:outline-none focus:border-blue-500"
                          />
                          <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">
                            {tokenKey}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-slate-400 w-12 text-right">
                          {percent.toFixed(0)}%
                        </span>

                        <button
                          type="button"
                          onClick={() => removeMilestone(idx)}
                          disabled={milestones.length <= 1}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400 disabled:opacity-30 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary Banner */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Escrow Commitment:</span>
                <span className="font-mono font-bold text-base text-blue-400">
                  {formatCurrencyAmount(totalAmount, 2)} {tokenKey}
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-sm"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  disabled={!isMilestonesValid || isSimulating}
                  onClick={handleProceedToSimulation}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Simulating On-Chain...</span>
                    </>
                  ) : (
                    <>
                      <span>Review & Simulate</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW, SIMULATE & EXECUTE */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-200">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
                  <Shield className="w-4 h-4" />
                  <span>Soroban Smart Contract Simulation Succeeded</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Estimated Resource Fee:</span>
                    <div className="font-mono font-semibold text-slate-100 mt-0.5">{simulationFee}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Smart Contract Target:</span>
                    <div className="font-mono font-semibold text-slate-100 mt-0.5 truncate">
                      {STELLAR_CONFIG.contractId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Agreement Review Summary */}
              <div className="space-y-3 text-xs border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Escrow Title</span>
                  <span className="font-semibold text-slate-200">{title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Provider Address</span>
                  <span className="font-mono text-slate-200">{providerAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Arbiter Address</span>
                  <span className="font-mono text-slate-200">{arbiterAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Milestones</span>
                  <span className="font-semibold text-slate-200">{milestones.length} Milestones</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Total Locked Value</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">
                    {formatCurrencyAmount(totalAmount, 2)} {tokenKey}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  id="fundImmediately"
                  checked={fundImmediately}
                  onChange={(e) => setFundImmediately(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                />
                <label htmlFor="fundImmediately" className="cursor-pointer">
                  Authorise immediate funding transfer from client wallet upon agreement registration
                </label>
              </div>

              {statusMessage && (
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-sm"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing & Deploying...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>Sign & Deploy Escrow</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
