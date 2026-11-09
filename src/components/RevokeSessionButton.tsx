"use client";

import React from 'react';

export interface RevokeSessionButtonProps {
  onRevoke: () => void;
}

export const RevokeSessionButton: React.FC<RevokeSessionButtonProps> = ({ onRevoke }) => {
  const handleRevoke = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.removeItem('strataflow_jwt');
      localStorage.removeItem('strataflow_wallet');
    }
    onRevoke();
  };

  return (
    <button
      type="button"
      onClick={handleRevoke}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium transition"
    >
      <span>✕</span>
      <span>Revoke Session</span>
    </button>
  );
};
