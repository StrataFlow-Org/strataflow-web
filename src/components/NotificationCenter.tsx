"use client";

import React, { useState } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAllRead?: () => void;
  onClear?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllRead,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 transition"
      >
        <span className="text-sm">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-xs font-semibold text-white">Notifications</h4>
            {unreadCount > 0 && onMarkAllRead && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="py-2 max-h-64 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No recent notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2.5 rounded-xl border text-xs transition ${
                    n.read
                      ? 'bg-transparent border-white/5 text-slate-400'
                      : 'bg-white/5 border-cyan-500/20 text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-white text-xs">{n.title}</div>
                  <div className="text-[11px] mt-0.5">{n.message}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
