"use client";

import React from 'react';

export interface Contact {
  name: string;
  address: string;
  tag?: string;
}

export interface AddressBookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onSelectContact?: (address: string) => void;
}

export const AddressBookDrawer: React.FC<AddressBookDrawerProps> = ({
  isOpen,
  onClose,
  contacts,
  onSelectContact,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-slate-900 border-l border-white/10 h-full p-6 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-base font-semibold text-white">Stellar Address Book</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          {contacts.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">No saved contacts</div>
          ) : (
            contacts.map((c, i) => (
              <div
                key={i}
                onClick={() => {
                  onSelectContact?.(c.address);
                  onClose();
                }}
                className="cursor-pointer p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-xs"
              >
                <div className="font-semibold text-white">{c.name}</div>
                <div className="font-mono text-[11px] text-slate-400 truncate mt-0.5">{c.address}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
