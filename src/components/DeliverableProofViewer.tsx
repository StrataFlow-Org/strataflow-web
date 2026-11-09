"use client";
import React from 'react';

export interface DeliverableProofViewerProps {
  proofHash: string;
}

export const DeliverableProofViewer: React.FC<DeliverableProofViewerProps> = ({ proofHash }) => {
  if (!proofHash) return <span className="text-xs text-slate-600 italic">No proof submitted</span>;
  const isIpfs = proofHash.startsWith('Qm') || proofHash.startsWith('bafy');
  const url = isIpfs ? `https://ipfs.io/ipfs/${proofHash}` : proofHash.startsWith('http') ? proofHash : null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="font-mono text-slate-300">{proofHash.slice(0, 12)}...</span>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          View Deliverable ↗
        </a>
      )}
    </div>
  );
};
