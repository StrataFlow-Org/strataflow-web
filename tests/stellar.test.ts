import { test } from 'node:test';
import assert from 'node:assert';
import { Keypair } from '@stellar/stellar-sdk';
import {
  isValidStellarAddress,
  isValidContractAddress,
  isValidStellarOrContractAddress,
  truncateAddress,
} from '../src/lib/stellar.js';

test('Stellar Address Utilities Unit Tests', async (t) => {
  const validKeypair = Keypair.random();
  const validPublicKey = validKeypair.publicKey();

  await t.test('identifies valid Stellar account public keys', () => {
    assert.strictEqual(isValidStellarAddress(validPublicKey), true);
    assert.strictEqual(isValidStellarAddress('invalid-key'), false);
    assert.strictEqual(isValidStellarAddress(''), false);
    assert.strictEqual(isValidStellarAddress('SBBD47...SECRET'), false); // Secret keys must be rejected
  });

  await t.test('identifies valid Soroban contract IDs', () => {
    const validContractId = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';
    assert.strictEqual(isValidContractAddress(validContractId), true);
    assert.strictEqual(isValidContractAddress(validPublicKey), false);
    assert.strictEqual(isValidContractAddress('C123BAD'), false);
  });

  await t.test('validates either account or contract address', () => {
    const validContractId = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';
    assert.strictEqual(isValidStellarOrContractAddress(validPublicKey), true);
    assert.strictEqual(isValidStellarOrContractAddress(validContractId), true);
    assert.strictEqual(isValidStellarOrContractAddress('not_an_address'), false);
  });

  await t.test('truncates addresses safely', () => {
    const truncated = truncateAddress(validPublicKey, 4);
    assert.strictEqual(truncated.length, 11); // 4 + 3 + 4 = 11
    assert.ok(truncated.startsWith(validPublicKey.slice(0, 4)));
    assert.ok(truncated.endsWith(validPublicKey.slice(-4)));

    assert.strictEqual(truncateAddress(''), '');
    assert.strictEqual(truncateAddress('ABC'), 'ABC');
  });
});

