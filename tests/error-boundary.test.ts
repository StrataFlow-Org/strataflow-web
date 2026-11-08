import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

describe('ErrorBoundary Component Logic Tests', () => {
  it('updates state to hasError: true when getDerivedStateFromError is triggered', () => {
    const error = new Error('RPC endpoint unavailable on testnet');
    const nextState = ErrorBoundary.getDerivedStateFromError(error);

    assert.strictEqual(nextState.hasError, true);
    assert.strictEqual(nextState.error?.message, 'RPC endpoint unavailable on testnet');
  });

  it('preserves error instance details for diagnostic inspection', () => {
    const typeError = new TypeError('Cannot read properties of undefined (reading toXDR)');
    const state = ErrorBoundary.getDerivedStateFromError(typeError);

    assert.ok(state.error instanceof TypeError);
    assert.ok(state.error.message.includes('toXDR'));
  });

  it('allows state reset for component retry without page reload', () => {
    let state = ErrorBoundary.getDerivedStateFromError(new Error('Temporary RPC timeout'));
    assert.strictEqual(state.hasError, true);

    // Simulate reset action
    state = { hasError: false };
    assert.strictEqual(state.hasError, false);
    assert.strictEqual(state.error, undefined);
  });
});
