"use client";
import React from 'react';

export interface DisputeCountdownBadgeProps {
  remainingSeconds: number;
}

export const DisputeCountdownBadge: React.FC<DisputeCountdownBadgeProps> = ({ remainingSeconds }) => {
  const isUrgent = remainingSeconds < 86400; // < 24 hours
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isUrgent ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-400 animate-ping' : 'bg-amber-400'}`} />
      <span>{days > 0 ? `${days}d ${hours}h left` : `${hours}h left`}</span>
    </div>
  );
};
