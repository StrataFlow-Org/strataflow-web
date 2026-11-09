"use client";

import React, { useEffect, useState } from 'react';

export const OfflineAlertBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-md bg-rose-950/90 border border-rose-500/40 rounded-xl p-3 shadow-2xl backdrop-blur-md flex items-center justify-between text-xs text-rose-200">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
        <span>You are currently offline. Soroban RPC requests will be queued.</span>
      </div>
      <button
        type="button"
        onClick={() => setIsOffline(false)}
        className="text-rose-400 hover:text-white ml-2 text-sm"
      >
        ✕
      </button>
    </div>
  );
};
