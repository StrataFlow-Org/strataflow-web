import { describe, it } from 'node:test';
import assert from 'node:assert';
import { StellarAnchorService, KNOWN_ANCHORS } from '../src/lib/stellar-anchor';

describe('StellarAnchorService Unit Tests', () => {
  const sampleKey = 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS';

  it('resolves SDF test anchor for USDC on testnet', () => {
    const anchor = StellarAnchorService.getAnchorForAsset('USDC', true);
    assert.ok(anchor);
    assert.strictEqual(anchor.domain, 'testanchor.stellar.org');
    assert.ok(anchor.supportedAssets.includes('USDC'));
  });

  it('resolves Circle anchor for USDC on mainnet', () => {
    const anchor = StellarAnchorService.getAnchorForAsset('USDC', false);
    assert.ok(anchor);
    assert.strictEqual(anchor.domain, 'circle.com');
  });

  it('builds interactive deposit URL with asset code and public key parameters', () => {
    const anchor = KNOWN_ANCHORS.SDF_TEST_ANCHOR;
    const url = StellarAnchorService.buildDepositUrl(anchor, 'USDC', sampleKey);

    assert.ok(url.startsWith('https://testanchor.stellar.org/sep24/transactions/deposit/interactive'));
    assert.ok(url.includes('asset_code=USDC'));
    assert.ok(url.includes(`account=${sampleKey}`));
  });

  it('returns null for unsupported asset codes', () => {
    const anchor = StellarAnchorService.getAnchorForAsset('RANDOM_TOKEN', true);
    assert.strictEqual(anchor, null);
  });
});

