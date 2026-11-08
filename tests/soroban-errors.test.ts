import { test } from 'node:test';
import assert from 'node:assert';
import { SorobanTxPipeline, STRATAFLOW_ERROR_MAP } from '../src/lib/soroban-tx.js';

test('Soroban Error Code Mapping Unit Tests', async () => {
  // Test known StrataFlow error codes
  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(1), STRATAFLOW_ERROR_MAP[1]);
  assert.match(SorobanTxPipeline.decodeErrorCode(1), /Protocol is currently paused/i);

  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(2), STRATAFLOW_ERROR_MAP[2]);
  assert.match(SorobanTxPipeline.decodeErrorCode(2), /already funded/i);

  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(6), STRATAFLOW_ERROR_MAP[6]);
  assert.match(SorobanTxPipeline.decodeErrorCode(6), /Sequential milestone delivery/i);

  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(13), STRATAFLOW_ERROR_MAP[13]);
  assert.match(SorobanTxPipeline.decodeErrorCode(13), /exceeds maximum allowed percentage/i);

  // Test unknown error fallback
  const fallback = SorobanTxPipeline.decodeErrorCode(999);
  assert.strictEqual(fallback, 'Contract error code: #999');
});

