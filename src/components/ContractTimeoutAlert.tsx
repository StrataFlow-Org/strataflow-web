"use client";

import React from 'react';

export interface ContractTimeoutAlertProps {
  hoursRemaining: number;
}

export const ContractTimeoutAlert: React.FC<ContractTimeoutAlertProps> = ({ hoursRemaining }) => {
  if (hoursRemaining > 48) return null;

  return (
    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
      <span>⏰</span>
      <span>
        Agreement deadline is approaching: <strong>{hoursRemaining} hours</strong> remaining until timeout refund is claimable.
      </span>
    </div>
  );
};
