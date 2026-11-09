"use client";

import React, { useState } from 'react';

export interface MilestoneProofUploadProps {
  onProofCalculated?: (hash: string, metadata: { name: string; size: number }) => void;
}

export const MilestoneProofUpload: React.FC<MilestoneProofUploadProps> = ({
  onProofCalculated,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [hashResult, setHashResult] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    // Compute simple mock hash client-side for deliverable verification
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    const cidLike = `ipfs://bafy${hashHex.slice(0, 46)}`;

    setHashResult(cidLike);
    onProofCalculated?.(cidLike, { name: file.name, size: file.size });
  };

  return (
    <div className="rounded-xl border border-dashed border-white/20 p-4 text-center bg-white/5">
      <input
        type="file"
        id="proof-file-input"
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor="proof-file-input"
        className="cursor-pointer inline-flex flex-col items-center gap-1.5"
      >
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
          ↑
        </div>
        <span className="text-xs font-medium text-white hover:underline">
          {fileName ? fileName : 'Upload Deliverable Proof File'}
        </span>
        <span className="text-[11px] text-slate-400">
          Client-side SHA-256 fingerprint generated automatically
        </span>
      </label>

      {hashResult && (
        <div className="mt-3 p-2 bg-slate-950 rounded-lg text-left border border-white/5">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Deliverable URI</div>
          <div className="font-mono text-xs text-emerald-400 break-all">{hashResult}</div>
          {fileSize && (
            <div className="text-[10px] text-slate-500 mt-0.5">
              {(fileSize / 1024).toFixed(1)} KB verified
            </div>
          )}
        </div>
      )}
    </div>
  );
};
