"use client";
import React from 'react';

export interface TxNotificationBannerProps {
  txHash: string;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  message: string;
  network?: string;
  onDismiss?: () => void;
}

export const TxNotificationBanner: React.FC<TxNotificationBannerProps> = ({ txHash, status, message, network = 'TESTNET', onDismiss }) => {
  const explorerUrl = `https://stellar.expert/explorer/${network.toLowerCase().includes('test') ? 'testnet' : 'public'}/tx/${txHash}`;
  const statusColor = status === 'SUCCESS' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : status === 'ERROR' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-blue-500/30 bg-blue-500/10 text-blue-400';

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs ${statusColor}`}>
      <div className="flex items-center gap-3">
        <span className="font-semibold">{message}</span>
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 font-mono">
          {txHash.slice(0, 8)}...
        </a>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-slate-400 hover:text-white">✕</button>
      )}
    </div>
  );
};
