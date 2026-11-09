"use client";

import React from 'react';

export interface MilestoneEvidencePreviewProps {
  evidenceUrl?: string;
  notes?: string;
}

export const MilestoneEvidencePreview: React.FC<MilestoneEvidencePreviewProps> = ({
  evidenceUrl,
  notes,
}) => {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-slate-950 space-y-2 text-xs">
      <h4 className="font-semibold text-white">Work Proof & Deliverable Notes</h4>
      {notes && <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{notes}</p>}
      {evidenceUrl && (
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[11px] truncate max-w-[240px]">
            {evidenceUrl}
          </span>
          <a
            href={evidenceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-cyan-400 hover:underline font-medium text-[11px]"
          >
            Open Evidence ↗
          </a>
        </div>
      )}
    </div>
  );
};
