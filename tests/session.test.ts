import { test } from 'node:test';
import assert from 'node:assert';
import { decodeSessionToken } from '../src/lib/session.js';

test('Session Token Decoding Tests', async (t) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const futureExp = Math.floor(Date.now() / 1000) + 3600;
  const payload = Buffer.from(
    JSON.stringify({
      sub: 'GBBD47...TEST_PUBKEY',
      iat: Math.floor(Date.now() / 1000),
      exp: futureExp,
      iss: 'strataflow-protocol',
    })
  ).toString('base64url');
  const sig = 'mock_signature';

  const validToken = `${header}.${payload}.${sig}`;

  await t.test('decodes valid JWT payload fields', () => {
    const session = decodeSessionToken(validToken);
    assert.ok(session);
    assert.strictEqual(session.sub, 'GBBD47...TEST_PUBKEY');
    assert.strictEqual(session.exp, futureExp);
    assert.strictEqual(session.iss, 'strataflow-protocol');
  });

  await t.test('returns null for malformed token', () => {
    assert.strictEqual(decodeSessionToken('invalid.token'), null);
    assert.strictEqual(decodeSessionToken(''), null);
  });
});
