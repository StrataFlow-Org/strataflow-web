"use client";

import React from 'react';

export interface KeyExportWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyExportWarningModal: React.FC<KeyExportWarningModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center text-lg mb-3">
          🚫
        </div>
        <h3 className="text-base font-semibold text-white">Never Share Secret Keys</h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          StrataFlow will NEVER ask for your secret key or recovery seed phrase. Anyone with your secret key can transfer your funds.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-rose-500 text-white font-semibold text-xs hover:bg-rose-400 transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
