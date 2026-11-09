"use client";

import React from 'react';

export interface AgreementAuditExporterProps {
  agreementId: string | number;
  auditTrail: any[];
}

export const AgreementAuditExporter: React.FC<AgreementAuditExporterProps> = ({
  agreementId,
  auditTrail,
}) => {
  const exportBundle = () => {
    const bundle = {
      agreementId,
      exportedAt: new Date().toISOString(),
      eventCount: auditTrail.length,
      events: auditTrail,
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-bundle-${agreementId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={exportBundle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-cyan-400 font-mono transition"
    >
      <span>📜</span>
      <span>Export Audit Bundle</span>
    </button>
  );
};
