"use client";
import React from 'react';

export interface SavedContact {
  label: string;
  address: string;
}

export interface AddressBookSelectorProps {
  contacts: SavedContact[];
  onSelect: (address: string) => void;
}

export const AddressBookSelector: React.FC<AddressBookSelectorProps> = ({ contacts, onSelect }) => {
  if (!contacts || contacts.length === 0) return null;
  return (
    <div className="flex gap-1.5 flex-wrap text-[11px] mt-1">
      <span className="text-slate-500">Quick Select:</span>
      {contacts.map((c) => (
        <button
          key={c.address}
          onClick={() => onSelect(c.address)}
          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          {c.label}
        </button>
      ))}
    </div>
  );
};
