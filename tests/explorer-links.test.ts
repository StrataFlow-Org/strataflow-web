import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getExplorerTxUrl,
  getExplorerAccountUrl,
  getExplorerContractUrl,
} from '../src/lib/stellar-network';

describe('Stellar Expert Explorer URL Generator Tests', () => {
  const sampleTx = 'e42ba5566fbc2646d2a7c41e8c105cb83015bbf099411d331923055f5f72cf7e';
  const sampleAccount = 'GBBD47IF6LWK7P7MDEVTESTWINNINGTALKER2026COMMITS';
  const sampleContract = 'CDLZ73VU7Y4Z45ETK26QU62NDXQJ2277NY2Y57C2ZFU7SS7M6HWT7G4H';

  it('generates testnet transaction URL on Stellar Expert', () => {
    const url = getExplorerTxUrl(sampleTx, 'testnet');
    assert.strictEqual(url, `https://stellar.expert/explorer/testnet/tx/${sampleTx}`);
  });

  it('generates public transaction URL on Stellar Expert', () => {
    const url = getExplorerTxUrl(sampleTx, 'public');
    assert.strictEqual(url, `https://stellar.expert/explorer/public/tx/${sampleTx}`);
  });

  it('generates testnet account URL on Stellar Expert', () => {
    const url = getExplorerAccountUrl(sampleAccount, 'testnet');
    assert.strictEqual(url, `https://stellar.expert/explorer/testnet/account/${sampleAccount}`);
  });

  it('generates testnet contract URL on Stellar Expert', () => {
    const url = getExplorerContractUrl(sampleContract, 'testnet');
    assert.strictEqual(url, `https://stellar.expert/explorer/testnet/contract/${sampleContract}`);
  });

  it('defaults gracefully when network is omitted or unknown', () => {
    const url = getExplorerTxUrl(sampleTx);
    assert.ok(url.includes('stellar.expert/explorer/'));
    assert.ok(url.endsWith(sampleTx));
  });
});

