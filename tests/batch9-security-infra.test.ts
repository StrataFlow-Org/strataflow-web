import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ClientNonceGenerator } from '../src/lib/crypto-nonce';
import { XssSanitizer } from '../src/lib/xss-sanitizer';
import { SecureSessionManager } from '../src/lib/secure-session';
import { WalletGuard } from '../src/lib/wallet-guard';
import { RpcWhitelist } from '../src/lib/rpc-whitelist';
import { WalletRetryHandler } from '../src/lib/wallet-retry';

describe('Batch 9 Security & Infrastructure Tests', () => {
  it('ClientNonceGenerator: produces valid hex nonces', () => {
    const nonce = ClientNonceGenerator.generateNonce(16);
    assert.equal(nonce.length, 32);
    assert.equal(ClientNonceGenerator.isValidNonce(nonce, 32), true);
    assert.equal(ClientNonceGenerator.isValidNonce('invalid-nonce', 32), false);
  });

  it('XssSanitizer: strips scripts and escapes entities', () => {
    const raw = '<script>alert(1)</script>Agreement Title';
    const clean = XssSanitizer.sanitize(raw);
    assert.ok(!clean.includes('<script>'));
    assert.ok(clean.includes('Agreement Title'));

    const stripped = XssSanitizer.stripTags('<b>Bold</b> Title');
    assert.equal(stripped, 'Bold Title');
  });

  it('SecureSessionManager: checks session expiry correctly', () => {
    assert.equal(SecureSessionManager.isSessionActive(Date.now() + 10000), true);
    assert.equal(SecureSessionManager.isSessionActive(Date.now() - 10000), false);
  });

  it('WalletGuard: validates Stellar Ed25519 public keys and contract IDs', () => {
    const validKey = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
    assert.equal(WalletGuard.isValidPublicKey(validKey), true);
    assert.equal(WalletGuard.isValidPublicKey('invalid_address'), false);

    const contractId = 'CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J';
    assert.equal(WalletGuard.isValidContractAddress(contractId), true);
    assert.equal(WalletGuard.sanitizeAddress('  ' + validKey + '  '), validKey);
  });

  it('RpcWhitelist: validates allowed Stellar RPC hostnames', () => {
    assert.equal(RpcWhitelist.isWhitelisted('https://soroban-testnet.stellar.org'), true);
    assert.equal(RpcWhitelist.isWhitelisted('https://horizon-testnet.stellar.org'), true);
    assert.equal(RpcWhitelist.isWhitelisted('http://localhost:8000/soroban/rpc'), true);
    assert.equal(RpcWhitelist.isWhitelisted('https://malicious-stellar-node.org'), false);
    assert.equal(RpcWhitelist.isWhitelisted('javascript:alert(1)'), false);
  });

  it('WalletRetryHandler: successfully retries transient failures', async () => {
    let calls = 0;
    const res = await WalletRetryHandler.executeWithRetry(async () => {
      calls++;
      if (calls < 2) throw new Error('wallet temporarily locked');
      return 'connected';
    }, 3, 10);

    assert.equal(res, 'connected');
    assert.equal(calls, 2);
  });
});
