"use client";

import React from 'react';

export interface DisputeResolutionBannerProps {
  arbiterAddress?: string;
  isCallerArbiter?: boolean;
  onResolveClick?: () => void;
}

export const DisputeResolutionBanner: React.FC<DisputeResolutionBannerProps> = ({
  arbiterAddress,
  isCallerArbiter = false,
  onResolveClick,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">⚖</span>
        <div>
          <h4 className="text-xs font-semibold text-rose-200">Active Dispute Resolution</h4>
          <p className="text-[11px] text-rose-300/80 mt-0.5">
            Funds are frozen under arbiter custody ({arbiterAddress ? `${arbiterAddress.slice(0, 4)}...${arbiterAddress.slice(-4)}` : 'Assigned Arbiter'}).
          </p>
        </div>
      </div>
      {isCallerArbiter && onResolveClick && (
        <button
          onClick={onResolveClick}
          className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-semibold text-xs hover:bg-rose-400 transition"
        >
          Resolve Payout
        </button>
      )}
    </div>
  );
};
