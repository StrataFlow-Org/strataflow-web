import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  sanitizeInputText,
  isValidDeliverableUrl,
  validateAgreementMetadata,
  validateMilestoneInput,
} from '../src/lib/input-validator';

describe('Input Validator & Client Sanitizer Tests', () => {
  it('neutralizes malicious XSS scripts and handlers in text inputs', () => {
    const malicious = 'Milestone 1 <script>alert("pwn")</script> Proof <img src=x onerror="steal()">';
    const cleaned = sanitizeInputText(malicious);

    assert.ok(!cleaned.includes('<script>'));
    assert.ok(!cleaned.includes('onerror'));
    assert.ok(cleaned.includes('Milestone 1'));
    assert.ok(cleaned.includes('Proof'));
  });

  it('validates genuine IPFS and HTTPS deliverable URLs', () => {
    assert.strictEqual(
      isValidDeliverableUrl('ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'),
      true
    );
    assert.strictEqual(
      isValidDeliverableUrl('https://github.com/StrataFlow-Org/strataflow-contracts/releases/tag/v1.0.0'),
      true
    );
    assert.strictEqual(isValidDeliverableUrl('javascript:alert(1)'), false);
    assert.strictEqual(isValidDeliverableUrl('http://insecure-site.com'), false);
  });

  it('validates agreement metadata length bounds', () => {
    const valid = validateAgreementMetadata('Mobile App Escrow', 'Full stack React Native app');
    assert.strictEqual(valid.isValid, true);
    assert.strictEqual(valid.errors.length, 0);

    const tooShort = validateAgreementMetadata('ab', 'Desc');
    assert.strictEqual(tooShort.isValid, false);
    assert.ok(tooShort.errors[0].includes('at least 3 characters'));
  });

  it('validates milestone input description and positive amount', () => {
    const valid = validateMilestoneInput('Smart contract audit', '1500');
    assert.strictEqual(valid.isValid, true);

    const zeroAmount = validateMilestoneInput('Smart contract audit', 0);
    assert.strictEqual(zeroAmount.isValid, false);
    assert.ok(zeroAmount.errors[0].includes('greater than 0'));
  });
});
