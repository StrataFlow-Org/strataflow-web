import { test } from 'node:test';
import assert from 'node:assert';

test('Milestone Percentage & Total Budget Calculation Tests', async () => {
  const milestones = [
    { description: 'M1', amount: '250' },
    { description: 'M2', amount: '250' },
    { description: 'M3', amount: '500' },
  ];

  const total = milestones.reduce((sum, m) => sum + parseFloat(m.amount), 0);
  assert.strictEqual(total, 1000);

  const percentages = milestones.map((m) => (parseFloat(m.amount) / total) * 100);
  assert.deepStrictEqual(percentages, [25, 25, 50]);

  const sumPercentages = percentages.reduce((a, b) => a + b, 0);
  assert.strictEqual(sumPercentages, 100);
});
