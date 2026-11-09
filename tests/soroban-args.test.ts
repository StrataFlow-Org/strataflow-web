import { test } from 'node:test';
import assert from 'node:assert';
import { Keypair } from '@stellar/stellar-sdk';
import { SorobanTxPipeline } from '../src/lib/soroban-tx.js';

test('Soroban ScVal Argument Serialization Unit Tests', async (t) => {
  const client = Keypair.random().publicKey();
  const provider = Keypair.random().publicKey();
  const arbiter = Keypair.random().publicKey();
  const token = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';

  await t.test('builds valid create_agreement ScVal arguments', () => {
    const args = SorobanTxPipeline.buildCreateAgreementArgs({
      client,
      provider,
      arbiter,
      token,
      totalAmount: 1000000000n,
      deadline: Math.floor(Date.now() / 1000) + 86400,
      milestoneDescriptions: ['Deliver MVP', 'Deploy Mainnet'],
      milestoneAmounts: [500000000n, 500000000n],
    });

    assert.strictEqual(args.length, 6);
  });

  await t.test('builds valid fund_agreement ScVal arguments', () => {
    const funder = Keypair.random().publicKey();
    const args = SorobanTxPipeline.buildFundAgreementArgs(101n, funder);
    assert.strictEqual(args.length, 2);
  });

  await t.test('builds valid submit_milestone ScVal arguments', () => {
    const args = SorobanTxPipeline.buildSubmitMilestoneArgs(101n, 0, 'QmHash12345');
    assert.strictEqual(args.length, 3);
  });

  await t.test('builds valid release_milestone ScVal arguments', () => {
    const args = SorobanTxPipeline.buildReleaseMilestoneArgs(101n, 0);
    assert.strictEqual(args.length, 2);
  });

  await t.test('builds valid resolve_dispute ScVal arguments', () => {
    const args = SorobanTxPipeline.buildResolveDisputeArgs(101n, 600000000n, 400000000n);
    assert.strictEqual(args.length, 3);
  });

  await t.test('builds valid bump_agreement_ttl ScVal arguments', () => {
    const args = SorobanTxPipeline.buildBumpAgreementTtlArgs(101n);
    assert.strictEqual(args.length, 1);
  });

  await t.test('builds valid resolve_dispute_timeout ScVal arguments', () => {
    const args = SorobanTxPipeline.buildResolveDisputeTimeoutArgs(101n);
    assert.strictEqual(args.length, 1);
  });

  await t.test('builds valid resolve_dispute_with_verdict ScVal arguments', () => {
    const args = SorobanTxPipeline.buildResolveDisputeWithVerdictArgs(
      101n,
      600000000n,
      400000000n,
      'bafybeic5verdict123456789'
    );
    assert.strictEqual(args.length, 4);
  });
});
