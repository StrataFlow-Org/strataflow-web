'use client';

import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export function NetworkBanner() {
  const { network, walletNetwork, isConnected } = useWallet();

  // If wallet is connected and reported a network that doesn't match dApp network
  const hasMismatch = isConnected && walletNetwork && walletNetwork.toUpperCase() !== network.toUpperCase();

  if (!hasMismatch) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Network Mismatch:</strong> Your wallet is currently connected to{' '}
            <span className="font-mono uppercase bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
              {walletNetwork}
            </span>
            , but StrataFlow is configured for{' '}
            <span className="font-mono uppercase bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
              {network}
            </span>
            . Please switch networks in your wallet extension.
          </span>
        </div>
        <a
          href="https://developers.stellar.org/docs/fundamentals-and-concepts/stellar-data-structures/networks"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 underline shrink-0"
        >
          <span>Learn more</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

