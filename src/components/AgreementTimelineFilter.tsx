"use client";

import React from 'react';

export type TimelineFilterType = 'ALL' | 'FUNDINGS' | 'DELIVERIES' | 'DISPUTES';

export interface AgreementTimelineFilterProps {
  selected: TimelineFilterType;
  onChange: (filter: TimelineFilterType) => void;
}

export const AgreementTimelineFilter: React.FC<AgreementTimelineFilterProps> = ({
  selected,
  onChange,
}) => {
  const filters: TimelineFilterType[] = ['ALL', 'FUNDINGS', 'DELIVERIES', 'DISPUTES'];

  return (
    <div className="inline-flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onChange(f)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            selected === f
              ? 'bg-cyan-500 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};
