"use client";

import React, { useState } from 'react';

export const HighContrastToggle: React.FC = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggle = () => {
    setIsHighContrast(!isHighContrast);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('high-contrast', !isHighContrast);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`p-1.5 rounded-lg border text-xs font-medium transition ${
        isHighContrast
          ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
      }`}
      title="Toggle high contrast accessibility mode"
      aria-pressed={isHighContrast}
    >
      👁 HC
    </button>
  );
};
