import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Agreement Event Stream & Timeline Formatting Tests', () => {
  interface OnChainTimelineEvent {
    type: string;
    ledger: number;
    txHash: string;
    timestamp: string;
  }

  const sampleEvents: OnChainTimelineEvent[] = [
    {
      type: 'AgreementCreated',
      ledger: 538000,
      txHash: '1111111111111111111111111111111111111111111111111111111111111111',
      timestamp: '2026-11-01T10:00:00Z',
    },
    {
      type: 'AgreementFunded',
      ledger: 538110,
      txHash: '2f50dde11504cf10a82643a6d71b80a71be70b43171350a417088b90c1e8e54e',
      timestamp: '2026-11-02T12:00:00Z',
    },
    {
      type: 'MilestoneSubmitted',
      ledger: 541092,
      txHash: 'e42ba5566fbc2646d2a7c41e8c105cb83015bbf099411d331923055f5f72cf7e',
      timestamp: '2026-11-05T14:30:00Z',
    },
  ];

  it('sorts events in reverse chronological order for activity stream', () => {
    const sorted = [...sampleEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    assert.strictEqual(sorted[0].type, 'MilestoneSubmitted');
    assert.strictEqual(sorted[2].type, 'AgreementCreated');
  });

  it('maps contract event types to user-friendly badge labels and tone classes', () => {
    const getBadgeConfig = (type: string) => {
      switch (type) {
        case 'AgreementFunded':
          return { label: 'Funded', tone: 'emerald' };
        case 'MilestoneApproved':
          return { label: 'Approved & Released', tone: 'emerald' };
        case 'DisputeRaised':
          return { label: 'In Dispute', tone: 'rose' };
        case 'DisputeResolved':
          return { label: 'Dispute Settled', tone: 'purple' };
        default:
          return { label: type, tone: 'blue' };
      }
    };

    assert.strictEqual(getBadgeConfig('AgreementFunded').tone, 'emerald');
    assert.strictEqual(getBadgeConfig('DisputeRaised').tone, 'rose');
    assert.strictEqual(getBadgeConfig('MilestoneSubmitted').tone, 'blue');
  });

  it('formats ledger sequence numbers with comma separators', () => {
    const formatLedger = (ledger: number) => ledger.toLocaleString();
    assert.strictEqual(formatLedger(541092), '541,092');
    assert.strictEqual(formatLedger(1000000), '1,000,000');
  });
});

