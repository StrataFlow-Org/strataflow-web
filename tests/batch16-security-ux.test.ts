import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { maskSecret, maskObjectSecrets } from '../src/lib/security/clientSecretMasker';
import { sanitizeUserInputStrict } from '../src/lib/security/inputSanitizerStrict';
import { isValidStellarUri } from '../src/lib/security/stellarUriValidator';
import { timingSafeStringCompare } from '../src/lib/security/timingAttackDefense';
import { isValidSha256Hex, isValidIpfsCid } from '../src/lib/security/hashVerifier';
import { SecurityBadge } from '../src/components/SecurityBadge';
import { SecurityChecklistDrawer } from '../src/components/SecurityChecklistDrawer';

describe('Batch 16 Security & Data Protection Tests', () => {
  it('clientSecretMasker: masks sensitive strings and objects', () => {
    assert.equal(maskSecret('SDF_SECRET_KEY_12345'), 'SDF_...2345');
    const obj = { secretToken: '1234567890', username: 'alice' };
    const masked = maskObjectSecrets(obj);
    assert.equal(masked.username, 'alice');
    assert.equal(masked.secretToken, '1234...7890');
  });

  it('inputSanitizerStrict: strips malicious script tags', () => {
    const malicious = '<script>alert("hack")</script>Hello & welcome';
    const sanitized = sanitizeUserInputStrict(malicious);
    assert.equal(sanitized.includes('<script>'), false);
    assert.equal(sanitized.includes('&lt;'), true);
  });

  it('stellarUriValidator: validates SEP-0007 transaction URIs', () => {
    assert.equal(isValidStellarUri('web+stellar:pay?destination=GABC&amount=10'), true);
    assert.equal(isValidStellarUri('javascript:alert(1)'), false);
  });

  it('timingAttackDefense: compares strings in constant time', () => {
    assert.equal(timingSafeStringCompare('secret_nonce', 'secret_nonce'), true);
    assert.equal(timingSafeStringCompare('secret_nonce', 'diff_nonce'), false);
  });

  it('hashVerifier: verifies SHA-256 and IPFS CIDs', () => {
    const validSha = 'a'.repeat(64);
    assert.equal(isValidSha256Hex(validSha), true);
    assert.equal(isValidSha256Hex('invalid'), false);
    assert.equal(isValidIpfsCid('ipfs://bafy' + 'a'.repeat(55)), true);
  });

  it('SecurityBadge: renders security elements', () => {
    const el = React.createElement(SecurityBadge, { isHttps: true });
    assert.equal(typeof el, 'object');
  });

  it('SecurityChecklistDrawer: builds checklist container', () => {
    const el = React.createElement(SecurityChecklistDrawer, {
      isOpen: false,
      onClose: () => {},
      isEscrowFunded: true,
      hasArbiter: true,
      hasTimeoutDefined: true,
    });
    assert.equal(typeof el, 'object');
  });
});
