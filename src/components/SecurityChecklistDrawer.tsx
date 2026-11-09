"use client";

import React from 'react';

export interface SecurityChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isEscrowFunded: boolean;
  hasArbiter: boolean;
  hasTimeoutDefined: boolean;
}

export const SecurityChecklistDrawer: React.FC<SecurityChecklistDrawerProps> = ({
  isOpen,
  onClose,
  isEscrowFunded,
  hasArbiter,
  hasTimeoutDefined,
}) => {
  if (!isOpen) return null;

  const checks = [
    { label: 'Contract Escrow Funded', status: isEscrowFunded },
    { label: 'Independent Arbiter Assigned', status: hasArbiter },
    { label: 'Expiration Timeout Configured', status: hasTimeoutDefined },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-slate-900 border-l border-white/10 h-full p-6 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-semibold text-white">Escrow Security Checklist</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <div className="mt-4 space-y-3">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
              <span className="text-slate-300">{c.label}</span>
              <span className={`font-bold ${c.status ? 'text-emerald-400' : 'text-amber-400'}`}>
                {c.status ? '✓ Protected' : '⚠ Action Needed'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
