'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { apiClient } from '../lib/api-client';
import { saveSessionToken, clearSessionToken, isSessionValid, getSessionAddress } from '../lib/session';

export function useSep10Auth() {
  const { address, signTransaction, isConnected } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check existing session validity on mount or wallet change
  useEffect(() => {
    if (isConnected && address) {
      const valid = isSessionValid();
      const sessionAddr = getSessionAddress();
      if (valid && sessionAddr === address) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [address, isConnected]);

  const login = useCallback(async (): Promise<boolean> => {
    if (!address || !isConnected) {
      setError('Please connect your wallet first');
      return false;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // 1. Request challenge from backend
      const challengeRes = await apiClient.post<{ challengeXdr: string; networkPassphrase: string }>(
        '/api/auth/challenge',
        { publicKey: address }
      );

      if (!challengeRes.success || !challengeRes.data?.challengeXdr) {
        throw new Error(challengeRes.error || 'Failed to request challenge transaction');
      }

      const { challengeXdr, networkPassphrase } = challengeRes.data;

      // 2. Request user wallet to sign challenge transaction
      const signedXdr = await signTransaction(challengeXdr, { networkPassphrase });

      if (!signedXdr) {
        throw new Error('Transaction signing was rejected by user');
      }

      // 3. Submit signed challenge to receive JWT token
      const tokenRes = await apiClient.post<{ token: string; publicKey: string }>(
        '/api/auth/token',
        {
          publicKey: address,
          signedXdr,
        }
      );

      if (!tokenRes.success || !tokenRes.data?.token) {
        throw new Error(tokenRes.error || 'Failed to authenticate challenge signature');
      }

      // 4. Save session token
      saveSessionToken(tokenRes.data.token);
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'SEP-10 authentication failed';
      setError(msg);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, isConnected, signTransaction]);

  const logout = useCallback(() => {
    clearSessionToken();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isAuthenticating,
    error,
    login,
    logout,
  };
}
