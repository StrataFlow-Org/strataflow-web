import { test } from 'node:test';
import assert from 'node:assert';

test('Dispute Split Calculation Unit Tests', async () => {
  const totalBalance = 10_000_000n; // 1 XLM in stroops

  const calculateSplit = (total: bigint, clientPercentage: number) => {
    const clientAmount = (total * BigInt(clientPercentage)) / 100n;
    const providerAmount = total - clientAmount;
    return { clientAmount, providerAmount };
  };

  // 50/50 split
  const split50 = calculateSplit(totalBalance, 50);
  assert.strictEqual(split50.clientAmount, 5_000_000n);
  assert.strictEqual(split50.providerAmount, 5_000_000n);
  assert.strictEqual(split50.clientAmount + split50.providerAmount, totalBalance);

  // 70/30 split
  const split70 = calculateSplit(totalBalance, 70);
  assert.strictEqual(split70.clientAmount, 7_000_000n);
  assert.strictEqual(split70.providerAmount, 3_000_000n);
  assert.strictEqual(split70.clientAmount + split70.providerAmount, totalBalance);

  // 100/0 split (full client refund)
  const split100 = calculateSplit(totalBalance, 100);
  assert.strictEqual(split100.clientAmount, totalBalance);
  assert.strictEqual(split100.providerAmount, 0n);

  // 0/100 split (full provider payout)
  const split0 = calculateSplit(totalBalance, 0);
  assert.strictEqual(split0.clientAmount, 0n);
  assert.strictEqual(split0.providerAmount, totalBalance);
});
