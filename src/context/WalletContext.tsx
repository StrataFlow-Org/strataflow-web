'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  isConnected as isFreighterConnected,
  getPublicKey as getFreighterPublicKey,
  getNetwork as getFreighterNetwork,
  signTransaction as signFreighterTransaction,
} from '@stellar/freighter-api';
import { fetchAccountBalances, AccountBalances } from '../lib/account-balance';
import { getActiveNetwork, StellarNetworkId } from '../lib/stellar-network';
import { WalletModal } from '../components/WalletModal';

export interface WalletContextType {
  address: string | null;
  network: StellarNetworkId;
  walletNetwork: string | null;
  walletType: string | null;
  isConnected: boolean;
  isLoading: boolean;
  balances: AccountBalances;
  connect: (walletType?: string) => Promise<void>;
  disconnect: () => void;
  signTransaction: (xdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY_WALLET_TYPE = 'strataflow_wallet_type';
const STORAGE_KEY_WALLET_ADDRESS = 'strataflow_wallet_address';
const DEMO_TESTNET_ADDRESS = 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS';

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [walletNetwork, setWalletNetwork] = useState<string | null>(null);
  const [network] = useState<StellarNetworkId>('TESTNET');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [balances, setBalances] = useState<AccountBalances>({ xlm: '0.0000000', tokens: [] });

  const activeNetConfig = getActiveNetwork(network);

  const refreshBalances = useCallback(async () => {
    if (!address) {
      setBalances({ xlm: '0.0000000', tokens: [] });
      return;
    }
    const result = await fetchAccountBalances(address, activeNetConfig.horizonUrl);
    setBalances(result);
  }, [address, activeNetConfig.horizonUrl]);

  // Periodic balance polling
  useEffect(() => {
    if (address) {
      refreshBalances();
      const interval = setInterval(refreshBalances, 15000);
      return () => clearInterval(interval);
    }
  }, [address, refreshBalances]);

  // Connect implementation
  const connect = useCallback(async (type: string = 'freighter') => {
    setIsLoading(true);
    try {
      if (type === 'demo') {
        setAddress(DEMO_TESTNET_ADDRESS);
        setWalletType('demo');
        setWalletNetwork('TESTNET');
        localStorage.setItem(STORAGE_KEY_WALLET_TYPE, 'demo');
        localStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, DEMO_TESTNET_ADDRESS);
        setIsModalOpen(false);
        return;
      }

      // Check Freighter extension
      const freighterAvailable = await isFreighterConnected();
      if (!freighterAvailable && type === 'freighter') {
        // Fallback to demo account with friendly alert
        alert('Freighter extension not detected. Switching to Testnet Demo wallet mode.');
        setAddress(DEMO_TESTNET_ADDRESS);
        setWalletType('demo');
        setWalletNetwork('TESTNET');
        localStorage.setItem(STORAGE_KEY_WALLET_TYPE, 'demo');
        localStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, DEMO_TESTNET_ADDRESS);
        setIsModalOpen(false);
        return;
      }

      const pubKey = await getFreighterPublicKey();
      if (!pubKey) {
        throw new Error('Wallet connection cancelled or rejected by user');
      }

      const detectedNet = await getFreighterNetwork();

      setAddress(pubKey);
      setWalletType(type);
      setWalletNetwork(detectedNet || 'TESTNET');

      localStorage.setItem(STORAGE_KEY_WALLET_TYPE, type);
      localStorage.setItem(STORAGE_KEY_WALLET_ADDRESS, pubKey);
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error('Wallet connection error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      alert(`Could not connect wallet: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setWalletType(null);
    setWalletNetwork(null);
    setBalances({ xlm: '0.0000000', tokens: [] });
    localStorage.removeItem(STORAGE_KEY_WALLET_TYPE);
    localStorage.removeItem(STORAGE_KEY_WALLET_ADDRESS);
  }, []);

  // Auto reconnect from localStorage on mount
  useEffect(() => {
    const savedType = localStorage.getItem(STORAGE_KEY_WALLET_TYPE);
    const savedAddr = localStorage.getItem(STORAGE_KEY_WALLET_ADDRESS);

    if (savedType && savedAddr) {
      setAddress(savedAddr);
      setWalletType(savedType);
      setWalletNetwork('TESTNET');
    }
  }, []);

  // Sign transaction
  const signTransaction = useCallback(
    async (xdr: string, opts?: { networkPassphrase?: string }): Promise<string> => {
      if (!address) {
        throw new Error('No wallet connected to sign transaction');
      }

      if (walletType === 'demo') {
        // In demo mode, simulate signature
        return xdr;
      }

      const passphrase = opts?.networkPassphrase || activeNetConfig.passphrase;
      const signed = await signFreighterTransaction(xdr, {
        networkPassphrase: passphrase,
      });

      if (!signed) {
        throw new Error('Transaction signing was rejected by user in Freighter');
      }

      return signed;
    },
    [address, walletType, activeNetConfig.passphrase]
  );

  return (
    <WalletContext.Provider
      value={{
        address,
        network,
        walletNetwork,
        walletType,
        isConnected: !!address,
        isLoading,
        balances,
        connect,
        disconnect,
        signTransaction,
        openWalletModal: () => setIsModalOpen(true),
        closeWalletModal: () => setIsModalOpen(false),
        refreshBalances,
      }}
    >
      {children}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectWallet={connect}
        isLoading={isLoading}
      />
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
