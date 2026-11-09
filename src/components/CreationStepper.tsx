"use client";
import React from 'react';

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

export interface CreationStepperProps {
  currentStep: number;
  steps: StepItem[];
}

export const CreationStepper: React.FC<CreationStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full flex items-center justify-between mb-8">
      {steps.map((step, idx) => {
        const isDone = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        return (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? '✓' : step.id}
              </div>
              <div className="hidden sm:block">
                <div className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-slate-400'}`}>{step.title}</div>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${isDone ? 'bg-emerald-500/50' : 'bg-slate-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
