'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, ExternalLink, X } from 'lucide-react';
import { getExplorerTxUrl } from '../lib/stellar-network';

export type ToastType = 'SUCCESS' | 'ERROR' | 'INFO' | 'TRANSACTION';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  txHash?: string;
  durationMs?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showTransaction: (title: string, txHash: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const duration = toast.durationMs ?? (toast.type === 'TRANSACTION' ? 10000 : 5000);

      const newItem: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev.slice(-4), newItem]); // Keep at most 5 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'SUCCESS', title, message });
    },
    [addToast]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'ERROR', title, message, durationMs: 7000 });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'INFO', title, message });
    },
    [addToast]
  );

  const showTransaction = useCallback(
    (title: string, txHash: string) => {
      addToast({ type: 'TRANSACTION', title, txHash });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showTransaction,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-5 text-xs ${
            t.type === 'SUCCESS'
              ? 'bg-slate-900/90 border-emerald-500/40 text-slate-100'
              : t.type === 'ERROR'
              ? 'bg-slate-900/90 border-rose-500/40 text-slate-100'
              : t.type === 'TRANSACTION'
              ? 'bg-slate-900/95 border-blue-500/50 text-slate-100'
              : 'bg-slate-900/90 border-slate-700 text-slate-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {t.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              {t.type === 'ERROR' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {t.type === 'TRANSACTION' && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
              {t.type === 'INFO' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

              <div>
                <strong className="font-semibold block text-white text-xs">{t.title}</strong>
                {t.message && <p className="text-slate-300 mt-0.5 text-[11px]">{t.message}</p>}
                {t.txHash && (
                  <a
                    href={getExplorerTxUrl(t.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-blue-400 hover:underline mt-1.5"
                  >
                    <span>View on Stellar Expert</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <button
              onClick={() => onRemove(t.id)}
              className="p-1 rounded text-slate-400 hover:text-white transition"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
