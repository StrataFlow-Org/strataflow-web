"use client";

import React, { useState } from 'react';

export interface ShareAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreementId: string | number;
  title: string;
}

export const ShareAgreementModal: React.FC<ShareAgreementModalProps> = ({
  isOpen,
  onClose,
  agreementId,
  title,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const agreementUrl = typeof window !== 'undefined' ? `${window.location.origin}/agreements/${agreementId}` : `/agreements/${agreementId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(agreementUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white">Share Agreement</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs text-slate-400 block mb-1.5">Direct Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={agreementUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                copied
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
