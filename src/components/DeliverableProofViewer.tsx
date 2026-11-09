"use client";
import React, { useState } from 'react';
import { IpfsUrlResolver } from '../lib/ipfs-url';

export interface DeliverableProofViewerProps {
  proofHash: string;
}

export const DeliverableProofViewer: React.FC<DeliverableProofViewerProps> = ({ proofHash }) => {
  const [copied, setCopied] = useState(false);
  const [showGateways, setShowGateways] = useState(false);

  if (!proofHash) {
    return <span className="text-xs text-slate-600 italic">No proof submitted</span>;
  }

  const isIpfs =
    proofHash.startsWith('Qm') || proofHash.startsWith('bafy') || proofHash.startsWith('ipfs://');
  const urls = isIpfs
    ? IpfsUrlResolver.getFallbackGatewayUrls(proofHash)
    : proofHash.startsWith('http')
    ? [proofHash]
    : [];
  const primaryUrl = urls[0] || null;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(proofHash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore
    }
  };

  const truncatedHash =
    proofHash.length > 20
      ? `${proofHash.slice(0, 10)}...${proofHash.slice(-6)}`
      : proofHash;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-mono text-slate-300 font-medium" title={proofHash}>
        {truncatedHash}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 transition"
        title="Copy raw hash or CID"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>

      {primaryUrl && (
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-0.5 font-medium"
        >
          <span>View Deliverable</span>
          <span className="text-[11px]">&nearr;</span>
        </a>
      )}

      {urls.length > 1 && (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setShowGateways(!showGateways)}
            className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Mirrors ({urls.length})
          </button>
          {showGateways && (
            <div className="absolute left-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-2 z-20 flex flex-col gap-1 text-[11px]">
              {urls.map((u, i) => {
                let domain = `Mirror ${i + 1}`;
                try {
                  domain = new URL(u).hostname.replace('www.', '');
                } catch {
                  // fallback
                }
                return (
                  <a
                    key={u}
                    href={u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline truncate"
                  >
                    #{i + 1}: {domain}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
