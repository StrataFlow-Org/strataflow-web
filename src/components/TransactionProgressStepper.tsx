"use client";

import React from 'react';

export type TxStep = 'BUILDING' | 'SIMULATING' | 'SIGNING' | 'SUBMITTING' | 'CONFIRMED';

export interface TransactionProgressStepperProps {
  currentStep: TxStep;
}

export const TransactionProgressStepper: React.FC<TransactionProgressStepperProps> = ({
  currentStep,
}) => {
  const steps: { key: TxStep; label: string }[] = [
    { key: 'BUILDING', label: 'Build' },
    { key: 'SIMULATING', label: 'Simulate' },
    { key: 'SIGNING', label: 'Sign' },
    { key: 'SUBMITTING', label: 'Broadcast' },
    { key: 'CONFIRMED', label: 'Confirmed' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const isDone = idx < currentIndex || currentStep === 'CONFIRMED';
          const isCurrent = idx === currentIndex && currentStep !== 'CONFIRMED';

          return (
            <div key={s.key} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : isCurrent
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 animate-pulse'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span className="mt-1 text-[10px] text-slate-400 font-medium">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
