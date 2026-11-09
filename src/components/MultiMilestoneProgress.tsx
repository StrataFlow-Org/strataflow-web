"use client";

import React from 'react';

export interface MultiMilestoneProgressProps {
  totalMilestones: number;
  approvedCount: number;
  submittedCount: number;
  disputedCount: number;
}

export const MultiMilestoneProgress: React.FC<MultiMilestoneProgressProps> = ({
  totalMilestones,
  approvedCount,
  submittedCount,
  disputedCount,
}) => {
  if (totalMilestones === 0) return null;

  const approvedPct = (approvedCount / totalMilestones) * 100;
  const submittedPct = (submittedCount / totalMilestones) * 100;
  const disputedPct = (disputedCount / totalMilestones) * 100;
  const pendingCount = totalMilestones - approvedCount - submittedCount - disputedCount;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-slate-400">
        <span>Milestone Completion</span>
        <span className="font-mono text-white font-semibold">
          {approvedCount} of {totalMilestones} approved
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden flex">
        {approvedPct > 0 && (
          <div
            style={{ width: `${approvedPct}%` }}
            className="bg-emerald-500 h-full transition-all duration-300"
            title={`Approved: ${approvedCount}`}
          />
        )}
        {submittedPct > 0 && (
          <div
            style={{ width: `${submittedPct}%` }}
            className="bg-cyan-500 h-full transition-all duration-300"
            title={`Submitted: ${submittedCount}`}
          />
        )}
        {disputedPct > 0 && (
          <div
            style={{ width: `${disputedPct}%` }}
            className="bg-rose-500 h-full transition-all duration-300"
            title={`Disputed: ${disputedCount}`}
          />
        )}
      </div>
      <div className="flex items-center gap-4 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Approved ({approvedCount})
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-500" /> Submitted ({submittedCount})
        </span>
        {disputedCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Disputed ({disputedCount})
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white/10" /> Pending ({Math.max(0, pendingCount)})
        </span>
      </div>
    </div>
  );
};
