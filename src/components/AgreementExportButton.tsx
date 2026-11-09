"use client";

import React from 'react';

export interface AgreementExportButtonProps {
  agreement: {
    id: string | number;
    title: string;
    status: string;
    client: string;
    provider: string;
    totalAmount: number;
  };
}

export const AgreementExportButton: React.FC<AgreementExportButtonProps> = ({ agreement }) => {
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(agreement, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `agreement-${agreement.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <button
      type="button"
      onClick={handleExportJson}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition"
    >
      <span>⬇</span>
      <span>Export JSON</span>
    </button>
  );
};
