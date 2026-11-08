import { test } from 'node:test';
import assert from 'node:assert';
import { getTokenConfig, SUPPORTED_TOKENS } from '../src/lib/tokens.js';

test('Token Preset Configuration Tests', async (t) => {
  await t.test('resolves preset for XLM', () => {
    const xlm = getTokenConfig('XLM');
    assert.strictEqual(xlm.code, 'XLM');
    assert.strictEqual(xlm.isNative, true);
    assert.strictEqual(xlm.contractId, SUPPORTED_TOKENS.XLM.contractId);
  });

  await t.test('resolves preset for USDC', () => {
    const usdc = getTokenConfig('USDC');
    assert.strictEqual(usdc.code, 'USDC');
    assert.strictEqual(usdc.isNative, false);
    assert.strictEqual(usdc.contractId, SUPPORTED_TOKENS.USDC.contractId);
  });

  await t.test('resolves custom SAC token contract address', () => {
    const customAddr = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';
    const custom = getTokenConfig(customAddr);
    assert.strictEqual(custom.code, 'CUSTOM');
    assert.strictEqual(custom.contractId, customAddr);
  });
});

