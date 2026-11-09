"use client";
import React from 'react';

export const AgreementSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800 rounded w-16" />
      </div>
      <div className="h-8 bg-slate-800/60 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-800/40 rounded w-full" />
        <div className="h-3 bg-slate-800/40 rounded w-4/5" />
      </div>
    </div>
  );
};
