"use client";
import React from 'react';

export interface DeadlineCountdownProps {
  deadlineTimestamp: number;
}

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({ deadlineTimestamp }) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = deadlineTimestamp - now;

  if (diff <= 0) {
    return <span className="text-red-400 font-semibold text-xs">Deadline Expired</span>;
  }

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  return (
    <span className="text-xs text-slate-400">
      Expires in <strong className="text-white">{days > 0 ? `${days}d ${hours}h` : `${hours}h`}</strong>
    </span>
  );
};
