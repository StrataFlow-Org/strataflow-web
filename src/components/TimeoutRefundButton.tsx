"use client";
import React from 'react';

export interface TimeoutRefundButtonProps {
  isEligible: boolean;
  onClaim: () => void;
  loading?: boolean;
}

export const TimeoutRefundButton: React.FC<TimeoutRefundButtonProps> = ({ isEligible, onClaim, loading = false }) => {
  return (
    <button
      disabled={!isEligible || loading}
      onClick={onClaim}
      className="px-4 py-2 rounded-xl text-xs font-semibold transition bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 disabled:opacity-40"
    >
      {loading ? 'Processing Refund...' : 'Claim Timeout Refund'}
    </button>
  );
};
