"use client";

import React from 'react';

export interface ContractVersionBadgeProps {
  versionMajor?: number;
  versionMinor?: number;
  isCompatible?: boolean;
}

export const ContractVersionBadge: React.FC<ContractVersionBadgeProps> = ({
  versionMajor = 1,
  versionMinor = 0,
  isCompatible = true,
}) => {
  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
      <span className={`w-1.5 h-1.5 rounded-full ${isCompatible ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <span>Contract v{versionMajor}.{versionMinor}</span>
      {!isCompatible && <span className="text-rose-400 font-bold">(Incompatible)</span>}
    </div>
  );
};
