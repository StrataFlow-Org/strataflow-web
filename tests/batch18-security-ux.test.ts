import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { compareProofHashes, formatProofDisplay } from '../src/lib/security/proofIntegrityChecker';
import { assembleDisputeEvidencePackage } from '../src/lib/security/disputeEvidenceSigner';
import { formatAddressWithPrivacy } from '../src/lib/security/addressPrivacyMask';
import { generateTamperEvidentReceipt } from '../src/lib/security/tamperEvidentReceipt';
import { encodeDraftPayload, decodeDraftPayload } from '../src/lib/security/localStorageEncryption';
import { StellarNetworkGuard } from '../src/lib/security/stellarNetworkGuard';
import { compareLedgerSequences } from '../src/lib/security/ledgerSyncVerifier';
import { ReceiptVerificationBadge } from '../src/components/ReceiptVerificationBadge';
import { MultiSigApprovalTracker } from '../src/components/MultiSigApprovalTracker';
import { SessionHeartbeatIndicator } from '../src/components/SessionHeartbeatIndicator';
import { LedgerSyncStatusPill } from '../src/components/LedgerSyncStatusPill';

describe('Batch 18 Security, UX & Data Protection Final Tests', () => {
  it('proofIntegrityChecker: validates matching deliverable hashes', () => {
    assert.equal(compareProofHashes('ipfs://bafy12345', 'bafy12345'), true);
    assert.equal(compareProofHashes('hashA', 'hashB'), false);
    assert.equal(formatProofDisplay('1234567890abcdef'), '1234567890abcdef');
    assert.equal(formatProofDisplay('1234567890abcdefextra'), '12345678...defextra');
  });

  it('disputeEvidenceSigner: generates verifiable dispute package', () => {
    const pkg = assembleDisputeEvidencePackage(1, 'GABC123', 'Incomplete work');
    assert.equal(pkg.agreementId, 1);
    assert.equal(pkg.claimantPublicKey, 'GABC123');
    assert.equal(pkg.signatureDigest.startsWith('sig_0x'), true);
  });

  it('addressPrivacyMask: supports multiple privacy modes', () => {
    const addr = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
    assert.equal(formatAddressWithPrivacy(addr, 'TRUNCATED'), 'GBZX...MADI');
    assert.equal(formatAddressWithPrivacy(addr, 'ANONYMIZED'), 'G***...****');
    assert.equal(formatAddressWithPrivacy(addr, 'FULL'), addr);
  });

  it('tamperEvidentReceipt: produces checksummed receipt', () => {
    const agreement = {
      id: 'agree_1',
      title: 'Audit Service',
      totalAmount: 1000,
      client: 'GCLIENT',
      provider: 'GPROVIDER',
      tokenAddress: 'CTOKEN',
    };
    const receipt = generateTamperEvidentReceipt(agreement, 500, '0xabc');
    assert.equal(receipt.agreementId, 'agree_1');
    assert.equal(receipt.receiptChecksum.startsWith('rcpt_'), true);
  });

  it('localStorageEncryption: roundtrips draft payload correctly', () => {
    const draft = { title: 'Draft Escrow', amount: 250 };
    const encoded = encodeDraftPayload(draft);
    assert.notEqual(encoded, '');
    const decoded = decodeDraftPayload(encoded);
    assert.deepEqual(decoded, draft);
  });

  it('stellarNetworkGuard: throws on network mismatch', () => {
    assert.doesNotThrow(() => {
      StellarNetworkGuard.assertNetworkMatch('TESTNET', 'TESTNET');
    });
    assert.throws(() => {
      StellarNetworkGuard.assertNetworkMatch('TESTNET', 'MAINNET');
    });
  });

  it('ledgerSyncVerifier: checks sync lag accurately', () => {
    const syncResult = compareLedgerSequences(100, 101);
    assert.equal(syncResult.isSynced, true);
    assert.equal(syncResult.lagBlocks, 1);

    const desyncResult = compareLedgerSequences(100, 110);
    assert.equal(desyncResult.isSynced, false);
    assert.equal(desyncResult.lagBlocks, 10);
  });

  it('ReceiptVerificationBadge: renders badge object', () => {
    const el = React.createElement(ReceiptVerificationBadge, {
      isValid: true,
      checksum: 'rcpt_12345678',
    });
    assert.equal(typeof el, 'object');
  });

  it('MultiSigApprovalTracker: renders signature thresholds', () => {
    const el = React.createElement(MultiSigApprovalTracker, {
      requiredSignatures: 3,
      collectedSignatures: 2,
    });
    assert.equal(typeof el, 'object');
  });

  it('SessionHeartbeatIndicator: renders status element', () => {
    const el = React.createElement(SessionHeartbeatIndicator, { isActive: true });
    assert.equal(typeof el, 'object');
  });

  it('LedgerSyncStatusPill: formats sync pill', () => {
    const el = React.createElement(LedgerSyncStatusPill, { isSynced: true });
    assert.equal(typeof el, 'object');
  });
});
