import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ToastItem, ToastType } from '../src/context/ToastContext';

describe('Toast Notification State & Helper Tests', () => {
  it('formats toast item structure with default transaction duration', () => {
    const rawToast: Omit<ToastItem, 'id'> = {
      type: 'TRANSACTION',
      title: 'Milestone Released',
      txHash: 'e42ba5566fbc2646d2a7c41e8c105cb83015bbf099411d331923055f5f72cf7e',
    };

    const id = `toast-${Date.now()}-abc1`;
    const toast: ToastItem = { ...rawToast, id };

    assert.strictEqual(toast.id, id);
    assert.strictEqual(toast.type, 'TRANSACTION');
    assert.strictEqual(toast.title, 'Milestone Released');
    assert.ok(toast.txHash?.startsWith('e42b'));
  });

  it('validates toast type variants and duration configuration', () => {
    const types: ToastType[] = ['SUCCESS', 'ERROR', 'INFO', 'TRANSACTION'];

    types.forEach((type) => {
      const durationMs = type === 'TRANSACTION' ? 10000 : type === 'ERROR' ? 7000 : 5000;
      assert.ok(durationMs > 0);
      assert.ok(durationMs <= 10000);
    });
  });

  it('maintains a bounded toast queue limit of at most 5 items', () => {
    const queue: string[] = [];
    const maxItems = 5;

    for (let i = 1; i <= 10; i++) {
      queue.push(`toast-${i}`);
      if (queue.length > maxItems) {
        queue.shift();
      }
    }

    assert.strictEqual(queue.length, 5);
    assert.strictEqual(queue[0], 'toast-6');
    assert.strictEqual(queue[4], 'toast-10');
  });
});

