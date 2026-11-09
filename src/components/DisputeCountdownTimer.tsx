"use client";

import React, { useEffect, useState } from 'react';

export interface DisputeCountdownTimerProps {
  expiresAtTimestamp: number;
  onExpire?: () => void;
}

export const DisputeCountdownTimer: React.FC<DisputeCountdownTimerProps> = ({
  expiresAtTimestamp,
  onExpire,
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState(
    Math.max(0, expiresAtTimestamp - Date.now())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, expiresAtTimestamp - Date.now());
      setTimeLeftMs(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAtTimestamp, onExpire]);

  const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

  const isCritical = hours < 24;

  return (
    <div
      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
        isCritical
          ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-current animate-ping" />
        <span>Arbiter Resolution Window:</span>
      </div>
      <div className="font-bold text-sm">
        {hours}h {minutes}m {seconds}s
      </div>
    </div>
  );
};
