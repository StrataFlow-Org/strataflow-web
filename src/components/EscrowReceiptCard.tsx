"use client";
import React from 'react';

export interface EscrowReceiptCardProps {
  agreementId: number | string;
  client: string;
  provider: string;
  amount: string;
  symbol?: string;
  txHash?: string;
}

export const EscrowReceiptCard: React.FC<EscrowReceiptCardProps> = ({ agreementId, client, provider, amount, symbol = 'XLM', txHash }) => {
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-3 font-mono">
      <div className="flex justify-between border-b border-slate-800 pb-2">
        <span className="text-slate-400">Escrow Receipt</span>
        <span className="text-emerald-400 font-bold">#{agreementId}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Client:</span>
        <span className="text-white">{client.slice(0, 8)}...</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Provider:</span>
        <span className="text-white">{provider.slice(0, 8)}...</span>
      </div>
      <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-slate-800">
        <span>Amount Escrowed:</span>
        <span className="text-emerald-400">{amount} {symbol}</span>
      </div>
      {txHash && (
        <div className="text-[10px] text-slate-500 truncate pt-1">
          Tx: {txHash}
        </div>
      )}
    </div>
  );
};
