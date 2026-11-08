import { test } from 'node:test';
import assert from 'node:assert';

test('Timeout Refund Eligibility Logic Tests', async (t) => {
  const isEligibleForRefund = (
    callerAddress: string,
    clientAddress: string,
    status: string,
    deadlineDate: string
  ) => {
    const isClient = callerAddress === clientAddress;
    const isFunded = status === 'FUNDED';
    const hasExpired = new Date(deadlineDate).getTime() < Date.now();
    return isClient && isFunded && hasExpired;
  };

  const client = 'GC_CLIENT_1';
  const other = 'GC_OTHER';

  await t.test('approves refund when client calls on expired funded agreement', () => {
    const expiredDeadline = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    assert.strictEqual(isEligibleForRefund(client, client, 'FUNDED', expiredDeadline), true);
  });

  await t.test('rejects refund if deadline has not passed yet', () => {
    const futureDeadline = new Date(Date.now() + 86400000).toISOString(); // 1 day in future
    assert.strictEqual(isEligibleForRefund(client, client, 'FUNDED', futureDeadline), false);
  });

  await t.test('rejects refund if agreement is not in FUNDED status', () => {
    const expiredDeadline = new Date(Date.now() - 3600000).toISOString();
    assert.strictEqual(isEligibleForRefund(client, client, 'COMPLETED', expiredDeadline), false);
    assert.strictEqual(isEligibleForRefund(client, client, 'CREATED', expiredDeadline), false);
  });

  await t.test('rejects refund if caller is not the client', () => {
    const expiredDeadline = new Date(Date.now() - 3600000).toISOString();
    assert.strictEqual(isEligibleForRefund(other, client, 'FUNDED', expiredDeadline), false);
  });
});
