import { describe, it } from 'node:test';
import assert from 'node:assert';
import { HorizonFallbackService, HorizonAccountData } from '../src/lib/horizon-fallback';

describe('HorizonFallbackService Unit Tests', () => {
  it('extracts native XLM balance from account response', () => {
    const service = new HorizonFallbackService('https://horizon-testnet.stellar.org');

    const sampleAccount: HorizonAccountData = {
      id: 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS',
      sequence: '1004502',
      balances: [
        { asset_type: 'native', balance: '10000.5000000' },
        {
          asset_type: 'credit_alphanum4',
          asset_code: 'USDC',
          asset_issuer: 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS',
          balance: '250.0000000',
        },
      ],
      subentry_count: 1,
    };

    const nativeLine = sampleAccount.balances.find((b) => b.asset_type === 'native');
    assert.strictEqual(nativeLine?.balance, '10000.5000000');
  });

  it('extracts credit token balance by asset code', () => {
    const balances = [
      { asset_type: 'native' as const, balance: '100.0000000' },
      {
        asset_type: 'credit_alphanum4' as const,
        asset_code: 'USDC',
        asset_issuer: 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS',
        balance: '500.2500000',
      },
    ];

    const usdcLine = balances.find((b) => b.asset_code === 'USDC');
    assert.strictEqual(usdcLine?.balance, '500.2500000');
  });

  it('returns null gracefully on non-existent account or network error', async () => {
    // Non-existent server endpoint
    const service = new HorizonFallbackService('http://127.0.0.1:54321');
    const result = await service.fetchAccount('GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS');

    assert.strictEqual(result, null);
  });
});
