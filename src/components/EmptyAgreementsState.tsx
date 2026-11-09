"use client";
import React from 'react';

export interface EmptyAgreementsStateProps {
  onCreateClick?: () => void;
}

export const EmptyAgreementsState: React.FC<EmptyAgreementsStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800">
      <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto mb-4 text-xl">📄</div>
      <h3 className="text-sm font-semibold text-white mb-1">No Agreements Found</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
        Create your first milestone escrow agreement on Stellar to start collaborating securely.
      </p>
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
        >
          Create Escrow Agreement
        </button>
      )}
    </div>
  );
};
