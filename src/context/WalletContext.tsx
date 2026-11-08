'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  network: string;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  setNetwork: (network: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>('TESTNET');

  const connect = async () => {
    // Connects via Freighter / Stellar Wallets Kit
    // Simulated wallet address for preview & dev verification
    setAddress('GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS');
  };

  const disconnect = () => {
    setAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        network,
        isConnected: !!address,
        connect,
        disconnect,
        setNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
