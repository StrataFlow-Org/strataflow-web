import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Network Mismatch Detection Logic Tests', () => {
  const evaluateMismatch = (
    isConnected: boolean,
    walletNetwork?: string,
    appNetwork: string = 'testnet'
  ): boolean => {
    if (!isConnected || !walletNetwork) return false;
    return walletNetwork.toUpperCase() !== appNetwork.toUpperCase();
  };

  it('detects mismatch when wallet is on MAINNET but dApp is configured for TESTNET', () => {
    const isMismatch = evaluateMismatch(true, 'PUBLIC', 'testnet');
    assert.strictEqual(isMismatch, true);
  });

  it('detects no mismatch when wallet and dApp are both on TESTNET', () => {
    const isMismatch = evaluateMismatch(true, 'TESTNET', 'testnet');
    assert.strictEqual(isMismatch, false);
  });

  it('handles case-insensitive network names correctly', () => {
    const isMismatch = evaluateMismatch(true, 'TestNet', 'TESTNET');
    assert.strictEqual(isMismatch, false);
  });

  it('returns false when wallet is disconnected regardless of network setting', () => {
    const isMismatch = evaluateMismatch(false, 'PUBLIC', 'testnet');
    assert.strictEqual(isMismatch, false);
  });

  it('returns false when wallet has not yet broadcast network metadata', () => {
    const isMismatch = evaluateMismatch(true, undefined, 'testnet');
    assert.strictEqual(isMismatch, false);
  });
});

