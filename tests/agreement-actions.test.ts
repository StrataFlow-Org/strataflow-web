import { test } from 'node:test';
import assert from 'node:assert';
import { SorobanTxPipeline } from '../src/lib/soroban-tx.js';

test('Agreement On-Chain Action Invocations Integration Tests', async (t) => {
  const agreementId = '101';

  await t.test('builds release_milestone arguments correctly', () => {
    const args = SorobanTxPipeline.buildReleaseMilestoneArgs(agreementId, 1);
    assert.strictEqual(args.length, 2);
  });

  await t.test('builds claim_timeout_refund arguments correctly', () => {
    const args = SorobanTxPipeline.buildClaimTimeoutRefundArgs(agreementId);
    assert.strictEqual(args.length, 1);
  });

  await t.test('builds raise_dispute arguments correctly', () => {
    const args = SorobanTxPipeline.buildRaiseDisputeArgs(agreementId);
    assert.strictEqual(args.length, 1);
  });

  await t.test('builds cancel_agreement arguments correctly', () => {
    const args = SorobanTxPipeline.buildCancelAgreementArgs(agreementId);
    assert.strictEqual(args.length, 1);
  });
});

