"use client";

import React from 'react';

export interface SessionHeartbeatIndicatorProps {
  isActive: boolean;
}

export const SessionHeartbeatIndicator: React.FC<SessionHeartbeatIndicatorProps> = ({ isActive }) => {
  return (
    <div
      className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400"
      title={isActive ? 'Session Active & Synchronized' : 'Session Inactive'}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
      <span>{isActive ? 'Session Live' : 'Disconnected'}</span>
    </div>
  );
};
