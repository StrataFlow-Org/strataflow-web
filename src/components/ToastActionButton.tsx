"use client";
import React from 'react';

export interface ToastActionButtonProps {
  label: string;
  onClick: () => void;
}

export const ToastActionButton: React.FC<ToastActionButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="ml-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white transition"
    >
      {label}
    </button>
  );
};
