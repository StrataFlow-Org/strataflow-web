"use client";
import React from 'react';

export type AgreementFilter = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED';

export interface AgreementFilterPillsProps {
  selected: AgreementFilter;
  onChange: (filter: AgreementFilter) => void;
  counts?: Partial<Record<AgreementFilter, number>>;
}

export const AgreementFilterPills: React.FC<AgreementFilterPillsProps> = ({ selected, onChange, counts = {} }) => {
  const filters: AgreementFilter[] = ['ALL', 'ACTIVE', 'COMPLETED', 'DISPUTED'];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filters.map((f) => {
        const isSel = selected === f;
        const count = counts[f];
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              isSel
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{f.charAt(0) + f.slice(1).toLowerCase()}</span>
            {count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSel ? 'bg-blue-700' : 'bg-slate-800'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
