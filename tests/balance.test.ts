import { test } from 'node:test';
import assert from 'node:assert';
import { stroopsToXlm, xlmToStroops, formatCurrencyAmount } from '../src/lib/account-balance.js';

test('Stroop & Balance Formatting Unit Tests', async (t) => {
  await t.test('converts whole stroops to XLM string', () => {
    assert.strictEqual(stroopsToXlm(10_000_000n), '1');
    assert.strictEqual(stroopsToXlm('50000000'), '5');
    assert.strictEqual(stroopsToXlm(100_000_000n), '10');
  });

  await t.test('converts fractional stroops to XLM string', () => {
    assert.strictEqual(stroopsToXlm(15_500_000n), '1.55');
    assert.strictEqual(stroopsToXlm(1n), '0.0000001');
    assert.strictEqual(stroopsToXlm(0n), '0');
  });

  await t.test('converts XLM string to BigInt stroops', () => {
    assert.strictEqual(xlmToStroops('1'), 10_000_000n);
    assert.strictEqual(xlmToStroops('1.55'), 15_500_000n);
    assert.strictEqual(xlmToStroops('0.0000001'), 1n);
    assert.strictEqual(xlmToStroops('0'), 0n);
    assert.strictEqual(xlmToStroops('100.25'), 1_002_500_000n);
  });

  await t.test('formats currency with comma separators', () => {
    assert.strictEqual(formatCurrencyAmount(1234.5, 2), '1,234.50');
    assert.strictEqual(formatCurrencyAmount('1000000', 2), '1,000,000.00');
  });
});
