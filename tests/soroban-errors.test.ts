import { test } from 'node:test';
import assert from 'node:assert';
import { SorobanTxPipeline, STRATAFLOW_ERROR_MAP } from '../src/lib/soroban-tx.js';

test('Soroban Error Code Mapping Unit Tests', async () => {
  // Test known StrataFlow error codes matching Rust contract
  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(1), STRATAFLOW_ERROR_MAP[1]);
  assert.match(SorobanTxPipeline.decodeErrorCode(1), /already been initialized/i);

  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(3), STRATAFLOW_ERROR_MAP[3]);
  assert.match(SorobanTxPipeline.decodeErrorCode(3), /unauthorized/i);

  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(13), STRATAFLOW_ERROR_MAP[13]);
  assert.match(SorobanTxPipeline.decodeErrorCode(13), /Protocol is currently paused/i);

  assert.strictEqual(SorobanTxPipeline.decodeErrorCode(17), STRATAFLOW_ERROR_MAP[17]);
  assert.match(SorobanTxPipeline.decodeErrorCode(17), /maximum ceiling/i);

  // Test unknown error fallback
  const fallback = SorobanTxPipeline.decodeErrorCode(999);
  assert.strictEqual(fallback, 'Contract error code: #999');
});

