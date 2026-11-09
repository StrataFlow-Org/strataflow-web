"use client";
import React from 'react';

export interface TokenPreset {
  code: string;
  name: string;
  contractId: string;
}

export interface TokenPresetPickerProps {
  selectedToken: string;
  onSelectToken: (token: TokenPreset) => void;
}

export const TokenPresetPicker: React.FC<TokenPresetPickerProps> = ({ selectedToken, onSelectToken }) => {
  const presets: TokenPreset[] = [
    { code: 'XLM', name: 'Native Stellar Lumens', contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC' },
    { code: 'USDC', name: 'USD Coin', contractId: 'CBIELTK6YBZJU5UP2WWQEUCYJLPU6QXNBDW5C7AAR3U3UK4CNU4EQMOH' },
  ];

  return (
    <div className="flex gap-2">
      {presets.map((t) => (
        <button
          key={t.code}
          type="button"
          onClick={() => onSelectToken(t)}
          className={`flex-1 p-2.5 rounded-xl border text-xs font-semibold transition text-left ${
            selectedToken === t.code
              ? 'bg-blue-600/10 border-blue-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div>{t.code}</div>
          <div className="text-[10px] text-slate-500 font-normal">{t.name}</div>
        </button>
      ))}
    </div>
  );
};
