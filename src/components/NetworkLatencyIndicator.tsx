"use client";

import React from 'react';

export interface NetworkLatencyIndicatorProps {
  latencyMs?: number | null;
  status?: 'CONNECTED' | 'DEGRADED' | 'DISCONNECTED';
}

export const NetworkLatencyIndicator: React.FC<NetworkLatencyIndicatorProps> = ({
  latencyMs = 85,
  status = 'CONNECTED',
}) => {
  const isHealthy = status === 'CONNECTED' && (latencyMs === null || latencyMs < 250);

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400"
      title={`Stellar RPC Latency: ${latencyMs ?? '--'}ms`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isHealthy ? 'bg-emerald-400' : status === 'DEGRADED' ? 'bg-amber-400' : 'bg-rose-400'
        }`}
      />
      <span>{latencyMs !== null ? `${latencyMs}ms` : 'offline'}</span>
    </div>
  );
};
