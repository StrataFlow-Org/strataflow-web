"use client";
import React from 'react';

export type UserRole = 'CLIENT' | 'PROVIDER' | 'ARBITER' | 'OBSERVER';

export interface UserRoleTagProps {
  role: UserRole;
}

export const UserRoleTag: React.FC<UserRoleTagProps> = ({ role }) => {
  const styles = {
    CLIENT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PROVIDER: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ARBITER: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    OBSERVER: 'bg-slate-800 text-slate-400 border-slate-700',
  }[role];

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${styles}`}>
      {role}
    </span>
  );
};
