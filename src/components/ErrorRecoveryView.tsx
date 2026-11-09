"use client";

import React from 'react';

export interface ErrorRecoveryViewProps {
  errorMessage: string;
  onRetry?: () => void;
  onSwitchRpc?: () => void;
}

export const ErrorRecoveryView: React.FC<ErrorRecoveryViewProps> = ({
  errorMessage,
  onRetry,
  onSwitchRpc,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-lg font-bold">
        !
      </div>
      <h3 className="text-sm font-semibold text-white">Transaction Execution Failed</h3>
      <p className="text-xs text-rose-300 font-mono max-w-md mx-auto break-words">{errorMessage}</p>

      <div className="pt-2 flex items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
          >
            Retry Call
          </button>
        )}
        {onSwitchRpc && (
          <button
            onClick={onSwitchRpc}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-semibold hover:bg-cyan-400 transition"
          >
            Switch RPC Endpoint
          </button>
        )}
      </div>
    </div>
  );
};
