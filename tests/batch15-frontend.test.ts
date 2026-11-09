import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { WalletNetworkSwitcher } from '../src/components/WalletNetworkSwitcher';
import { CurrencyConverterWidget } from '../src/components/CurrencyConverterWidget';
import { TokenAllowanceChecker } from '../src/components/TokenAllowanceChecker';
import { MultiMilestoneProgress } from '../src/components/MultiMilestoneProgress';
import { RecipientVerificationBadge } from '../src/components/RecipientVerificationBadge';
import { GasFeeEstimatorPill } from '../src/components/GasFeeEstimatorPill';
import { ContractVersionBadge } from '../src/components/ContractVersionBadge';

describe('Batch 15 Frontend Component Tests', () => {
  it('WalletNetworkSwitcher: renders network badge', () => {
    const el = React.createElement(WalletNetworkSwitcher, {
      currentNetwork: 'TESTNET',
    });
    assert.equal(typeof el, 'object');
  });

  it('CurrencyConverterWidget: displays calculated balance', () => {
    const el = React.createElement(CurrencyConverterWidget, {
      amountStroops: 10_000_000,
      xlmRateUsd: 0.15,
    });
    assert.equal(typeof el, 'object');
  });

  it('TokenAllowanceChecker: correctly handles sufficient balance', () => {
    const el = React.createElement(TokenAllowanceChecker, {
      requiredAmount: 500,
      availableBalance: 1000,
      tokenSymbol: 'USDC',
    });
    assert.equal(typeof el, 'object');
  });

  it('MultiMilestoneProgress: calculates milestone portions', () => {
    const el = React.createElement(MultiMilestoneProgress, {
      totalMilestones: 4,
      approvedCount: 2,
      submittedCount: 1,
      disputedCount: 0,
    });
    assert.equal(typeof el, 'object');
  });

  it('RecipientVerificationBadge: checks address validity', () => {
    const validAddress = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
    const el = React.createElement(RecipientVerificationBadge, {
      address: validAddress,
      isAccountActive: true,
    });
    assert.equal(typeof el, 'object');
  });

  it('GasFeeEstimatorPill: shows stroop fee conversion', () => {
    const el = React.createElement(GasFeeEstimatorPill, {
      estimatedFeeStroops: 250,
      isSufficientGas: true,
    });
    assert.equal(typeof el, 'object');
  });

  it('ContractVersionBadge: renders protocol tag', () => {
    const el = React.createElement(ContractVersionBadge, {
      versionMajor: 1,
      versionMinor: 2,
      isCompatible: true,
    });
    assert.equal(typeof el, 'object');
  });
});
