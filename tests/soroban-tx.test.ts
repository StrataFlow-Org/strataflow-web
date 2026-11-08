import { test } from 'node:test';
import assert from 'node:assert';
import { Keypair } from '@stellar/stellar-sdk';
import { SorobanTxPipeline } from '../src/lib/soroban-tx.js';

test('SorobanTxPipeline Integration & Operation Builder Tests', async () => {
  const pipeline = new SorobanTxPipeline('TESTNET');
  const contractId = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';

  const op = pipeline.buildInvocation(
    contractId,
    'get_version',
    []
  );

  assert.ok(op);
  assert.strictEqual(op.body().switch().name, 'invokeHostFunction');

  const keypair = Keypair.random();
  const address = keypair.publicKey();
  const addrScVal = SorobanTxPipeline.encodeAddress(address);
  assert.ok(addrScVal);

  const u64ScVal = SorobanTxPipeline.encodeU64(123456789n);
  assert.ok(u64ScVal);

  const i128ScVal = SorobanTxPipeline.encodeI128(987654321n);
  assert.ok(i128ScVal);
});
