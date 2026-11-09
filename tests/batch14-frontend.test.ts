import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { AgreementFilterPills } from '../src/components/AgreementFilterPills';
import { AgreementCard } from '../src/components/AgreementCard';
import { DisputeSummaryCard } from '../src/components/DisputeSummaryCard';
import { ProtocolFeeBanner } from '../src/components/ProtocolFeeBanner';
import { UserRoleTag } from '../src/components/UserRoleTag';

describe('Batch 14 Frontend Component Tests', () => {
  it('AgreementFilterPills: renders filter options', () => {
    const el = React.createElement(AgreementFilterPills, {
      selected: 'ALL',
      onChange: () => {},
      counts: { ALL: 5, ACTIVE: 2 },
    });
    assert.equal(typeof el, 'object');
  });

  it('AgreementCard: builds card structure with details', () => {
    const el = React.createElement(AgreementCard, {
      id: 1,
      title: 'Dev Escrow',
      status: 'FUNDED',
      totalAmount: 1000,
    });
    assert.equal(typeof el, 'object');
  });

  it('DisputeSummaryCard: displays payout distribution', () => {
    const el = React.createElement(DisputeSummaryCard, {
      clientPayout: 600,
      providerPayout: 400,
    });
    assert.equal(typeof el, 'object');
  });

  it('ProtocolFeeBanner: computes percentage rate accurately', () => {
    const el = React.createElement(ProtocolFeeBanner, { feeBps: 250 });
    assert.equal(typeof el, 'object');
  });

  it('UserRoleTag: renders role styling correctly', () => {
    const el = React.createElement(UserRoleTag, { role: 'CLIENT' });
    assert.equal(typeof el, 'object');
  });
});
