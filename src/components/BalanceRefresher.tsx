"use client";
import React, { useState } from 'react';

export interface BalanceRefresherProps {
  onRefresh: () => Promise<void>;
}

export const BalanceRefresher: React.FC<BalanceRefresherProps> = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onRefresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition disabled:opacity-50 text-xs"
      title="Refresh balances"
    >
      <span className={loading ? 'inline-block animate-spin' : ''}>🔄</span>
    </button>
  );
};
