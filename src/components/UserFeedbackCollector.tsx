"use client";

import React, { useState } from 'react';

export interface UserFeedbackCollectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback?: (feedback: string) => void;
}

export const UserFeedbackCollector: React.FC<UserFeedbackCollectorProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback?.(feedback);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-base font-semibold text-white">Report Feedback or Soroban Issue</h3>
        <p className="text-xs text-slate-400 mt-1">
          Help improve StrataFlow escrow stability and Stellar integration.
        </p>

        {submitted ? (
          <div className="my-6 text-center text-xs font-semibold text-emerald-400">
            ✓ Thank you! Your feedback has been received.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe the transaction anomaly or UX issue..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
