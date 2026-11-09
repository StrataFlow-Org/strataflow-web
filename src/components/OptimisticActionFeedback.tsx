"use client";

import React from 'react';

export interface OptimisticActionFeedbackProps {
  isPending: boolean;
  actionText: string;
}

export const OptimisticActionFeedback: React.FC<OptimisticActionFeedbackProps> = ({
  isPending,
  actionText,
}) => {
  if (!isPending) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      <span>{actionText}... (Optimistic update applied)</span>
    </div>
  );
};
