"use client";

import React from 'react';

export interface DataExportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agreementData: any;
}

export const DataExportDrawer: React.FC<DataExportDrawerProps> = ({
  isOpen,
  onClose,
  agreementData,
}) => {
  if (!isOpen) return null;

  const handleDownload = (format: 'json' | 'csv') => {
    let content = '';
    let mime = 'application/json';
    let ext = 'json';

    if (format === 'json') {
      content = JSON.stringify(agreementData, null, 2);
    } else {
      mime = 'text/csv';
      ext = 'csv';
      content = `ID,Title,Amount,Status\n"${agreementData.id}","${agreementData.title}","${agreementData.totalAmount}","${agreementData.status}"`;
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escrow-export-${agreementData.id || 'all'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-slate-900 border-l border-white/10 h-full p-6 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-semibold text-white">Export Escrow Data</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-xs text-slate-400">
            Download cryptographic audit records of agreement terms, milestones, and ledger proofs.
          </p>

          <button
            onClick={() => handleDownload('json')}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
          >
            <span>📄</span> Export Full JSON Audit Record
          </button>

          <button
            onClick={() => handleDownload('csv')}
            className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-medium text-xs flex items-center justify-center gap-2 transition"
          >
            <span>📊</span> Export Summary CSV
          </button>
        </div>
      </div>
    </div>
  );
};
