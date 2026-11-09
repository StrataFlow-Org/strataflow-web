"use client";
import React from 'react';

export interface SimulationStatusPillProps {
  status: 'SIMULATING' | 'SUCCESS' | 'FAILED' | 'IDLE';
}

export const SimulationStatusPill: React.FC<SimulationStatusPillProps> = ({ status }) => {
  if (status === 'IDLE') return null;
  const config = {
    SIMULATING: { text: 'Simulating on Soroban...', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    SUCCESS: { text: 'Simulation Passed ✓', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    FAILED: { text: 'Simulation Failed ✕', bg: 'bg-red-500/10 text-red-400 border-red-500/20' },
  }[status];

  return (
    <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.bg}`}>
      {config.text}
    </div>
  );
};
