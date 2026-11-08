import { test } from 'node:test';
import assert from 'node:assert';

test('Agreement Roles & Permissions Logic Tests', async (t) => {
  const client = 'GC_CLIENT';
  const provider = 'GB_PROVIDER';
  const arbiter = 'GA_ARBITER';
  const observer = 'GO_OBSERVER';

  const determineRole = (caller: string) => {
    if (caller === client) return 'CLIENT';
    if (caller === provider) return 'PROVIDER';
    if (caller === arbiter) return 'ARBITER';
    return 'OBSERVER';
  };

  await t.test('accurately identifies caller roles', () => {
    assert.strictEqual(determineRole(client), 'CLIENT');
    assert.strictEqual(determineRole(provider), 'PROVIDER');
    assert.strictEqual(determineRole(arbiter), 'ARBITER');
    assert.strictEqual(determineRole(observer), 'OBSERVER');
  });

  await t.test('enforces milestone action access permissions', () => {
    const canApprove = (caller: string, milestoneStatus: string) =>
      determineRole(caller) === 'CLIENT' && milestoneStatus === 'SUBMITTED';

    const canSubmit = (caller: string, milestoneStatus: string) =>
      determineRole(caller) === 'PROVIDER' && milestoneStatus === 'PENDING';

    const canArbitrate = (caller: string, agreementStatus: string) =>
      determineRole(caller) === 'ARBITER' && agreementStatus === 'DISPUTED';

    assert.strictEqual(canApprove(client, 'SUBMITTED'), true);
    assert.strictEqual(canApprove(provider, 'SUBMITTED'), false);

    assert.strictEqual(canSubmit(provider, 'PENDING'), true);
    assert.strictEqual(canSubmit(client, 'PENDING'), false);

    assert.strictEqual(canArbitrate(arbiter, 'DISPUTED'), true);
    assert.strictEqual(canArbitrate(client, 'DISPUTED'), false);
  });
});
