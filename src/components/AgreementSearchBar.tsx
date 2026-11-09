"use client";
import React from 'react';

export interface AgreementSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const AgreementSearchBar: React.FC<AgreementSearchBarProps> = ({ value, onChange, placeholder = 'Search agreements by ID or party...' }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
        >
          ✕
        </button>
      )}
    </div>
  );
};
