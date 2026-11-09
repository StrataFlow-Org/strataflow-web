"use client";
import React from 'react';

export interface AgreementRow {
  id: number | string;
  title: string;
  status: string;
  amount: string;
}

export interface AgreementTableViewProps {
  agreements: AgreementRow[];
  onSelect: (id: number | string) => void;
}

export const AgreementTableView: React.FC<AgreementTableViewProps> = ({ agreements, onSelect }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-900/80 text-slate-500 uppercase text-[10px]">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Title</th>
            <th className="p-3">Status</th>
            <th className="p-3">Amount</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {agreements.map((a) => (
            <tr key={a.id} className="hover:bg-slate-800/30">
              <td className="p-3">#{a.id}</td>
              <td className="p-3 font-sans text-white font-medium">{a.title}</td>
              <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800">{a.status}</span></td>
              <td className="p-3 text-emerald-400">{a.amount}</td>
              <td className="p-3 text-right">
                <button onClick={() => onSelect(a.id)} className="text-blue-400 hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
