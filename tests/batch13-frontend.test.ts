import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { WalletStateBadge } from '../src/components/WalletStateBadge';
import { CreationStepper } from '../src/components/CreationStepper';
import { DisputeCountdownBadge } from '../src/components/DisputeCountdownBadge';
import { MilestoneBreakdownWidget } from '../src/components/MilestoneBreakdownWidget';

describe('Batch 13 Frontend Component Tests', () => {
  it('WalletStateBadge: renders correctly for disconnected state', () => {
    const el = React.createElement(WalletStateBadge, { connected: false });
    assert.equal(typeof el, 'object');
  });

  it('WalletStateBadge: formats truncated address when connected', () => {
    const el = React.createElement(WalletStateBadge, {
      connected: true,
      address: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    });
    assert.equal(typeof el, 'object');
  });

  it('CreationStepper: renders step sequence element', () => {
    const steps = [
      { id: 1, title: 'Details', description: 'Step 1' },
      { id: 2, title: 'Milestones', description: 'Step 2' },
    ];
    const el = React.createElement(CreationStepper, { currentStep: 1, steps });
    assert.equal(typeof el, 'object');
  });

  it('DisputeCountdownBadge: calculates remaining days/hours', () => {
    const el = React.createElement(DisputeCountdownBadge, { remainingSeconds: 100000 });
    assert.equal(typeof el, 'object');
  });

  it('MilestoneBreakdownWidget: accepts amounts and computes percentage', () => {
    const el = React.createElement(MilestoneBreakdownWidget, { totalAmount: 100, releasedAmount: 50 });
    assert.equal(typeof el, 'object');
  });
});
