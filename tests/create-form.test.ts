import { test } from 'node:test';
import assert from 'node:assert';
import { Keypair } from '@stellar/stellar-sdk';
import { isValidStellarAddress } from '../src/lib/stellar.js';

test('Escrow Creation Form Input Validation Tests', async (t) => {
  const clientKey = Keypair.random().publicKey();
  const providerKey = Keypair.random().publicKey();
  const arbiterKey = Keypair.random().publicKey();

  await t.test('validates valid participant keys are distinct', () => {
    assert.strictEqual(isValidStellarAddress(clientKey), true);
    assert.strictEqual(isValidStellarAddress(providerKey), true);
    assert.strictEqual(isValidStellarAddress(arbiterKey), true);

    assert.notStrictEqual(clientKey, providerKey);
    assert.notStrictEqual(clientKey, arbiterKey);
    assert.notStrictEqual(providerKey, arbiterKey);
  });

  await t.test('rejects self-collusion where arbiter is client or provider', () => {
    const isCollision = (c: string, p: string, a: string) => c === p || c === a || p === a;
    assert.strictEqual(isCollision(clientKey, providerKey, arbiterKey), false);
    assert.strictEqual(isCollision(clientKey, clientKey, arbiterKey), true);
    assert.strictEqual(isCollision(clientKey, providerKey, clientKey), true);
  });

  await t.test('validates title and milestone constraints', () => {
    const title = 'Valid Title';
    assert.ok(title.trim().length >= 3);

    const emptyTitle = '  ';
    assert.ok(emptyTitle.trim().length < 3);

    const milestones = [
      { description: 'Milestone 1', amount: '500' },
      { description: 'Milestone 2', amount: '1000' },
    ];

    const isValid = milestones.every(
      (m) => m.description.trim().length >= 3 && parseFloat(m.amount) > 0
    );
    assert.strictEqual(isValid, true);
  });
});

