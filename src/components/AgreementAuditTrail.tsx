"use client";

import React from 'react';

export interface AuditEvent {
  id: string;
  action: string;
  caller: string;
  ledgerSequence?: number;
  timestamp: number;
}

export interface AgreementAuditTrailProps {
  events: AuditEvent[];
}

export const AgreementAuditTrail: React.FC<AgreementAuditTrailProps> = ({ events }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <h3 className="text-xs font-semibold text-white tracking-wider uppercase mb-3">
        On-Chain Audit Trail
      </h3>
      {events.length === 0 ? (
        <div className="text-xs text-slate-500 text-center py-4">No audit events logged</div>
      ) : (
        <div className="space-y-2.5">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 border border-white/5 font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="font-semibold text-white">{evt.action}</span>
                <span className="text-slate-400 text-[11px]">
                  by {evt.caller.slice(0, 4)}...{evt.caller.slice(-4)}
                </span>
              </div>
              <div className="text-slate-500 text-[11px]">
                {evt.ledgerSequence && `Ledger #${evt.ledgerSequence.toLocaleString()} • `}
                {new Date(evt.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
