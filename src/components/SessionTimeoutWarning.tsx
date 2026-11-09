"use client";

import React from 'react';

export interface SessionTimeoutWarningProps {
  isOpen: boolean;
  minutesRemaining: number;
  onRenewSession?: () => void;
  onDismiss?: () => void;
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  isOpen,
  minutesRemaining,
  onRenewSession,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg">
            ⏱
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Session Expiring Soon</h3>
            <p className="text-xs text-slate-400">
              Your SEP-10 session expires in {minutesRemaining} minute{minutesRemaining === 1 ? '' : 's'}.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          )}
          {onRenewSession && (
            <button
              type="button"
              onClick={onRenewSession}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
            >
              Renew Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
