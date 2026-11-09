"use client";
import React from 'react';

export interface ActivityItem {
  id: string;
  type: string;
  label: string;
  timestamp: number;
}

export interface TimelineActivityFeedProps {
  items: ActivityItem[];
}

export const TimelineActivityFeed: React.FC<TimelineActivityFeedProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return <div className="text-xs text-slate-500 italic py-4">No activity events recorded yet.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-white font-medium">{item.label}</span>
          </div>
          <span className="text-slate-500 text-[10px] font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
};
