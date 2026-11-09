import { test } from 'node:test';
import assert from 'node:assert';
import { Keypair } from '@stellar/stellar-sdk';
import { SorobanTxPipeline } from '../src/lib/soroban-tx.js';
import { xlmToStroops } from '../src/lib/account-balance.js';

test('Agreement Creation Payload Assembler Integration Tests', async () => {
  const client = Keypair.random().publicKey();
  const provider = Keypair.random().publicKey();
  const arbiter = Keypair.random().publicKey();
  const token = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';

  const milestones = [
    { description: 'Sprint 1', amount: '100' },
    { description: 'Sprint 2', amount: '200' },
  ];

  const totalAmount = 300;
  const deadlineSec = Math.floor(Date.now() / 1000) + 86400 * 30;

  const args = SorobanTxPipeline.buildCreateAgreementArgs({
    client,
    provider,
    arbiter,
    token,
    totalAmount: xlmToStroops(totalAmount),
    deadline: deadlineSec,
    milestoneDescriptions: milestones.map((m) => m.description),
    milestoneAmounts: milestones.map((m) => xlmToStroops(m.amount)),
  });

  assert.strictEqual(args.length, 6);
  assert.ok(args[0]); // client
  assert.ok(args[1]); // provider
  assert.ok(args[2]); // arbiter
  assert.ok(args[3]); // token
  assert.ok(args[4]); // milestones array
  assert.ok(args[5]); // deadline
});

