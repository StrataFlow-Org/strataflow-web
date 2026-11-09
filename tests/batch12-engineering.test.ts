import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TypedContractBuilder } from '../src/lib/typed-contract-builder';
import { ErrorClassificationMap } from '../src/lib/error-map';
import { TimelineNormalizer } from '../src/lib/timeline-normalizer';
import { SimulationInspector } from '../src/lib/simulation-inspector';
import { ExplorerResolver } from '../src/lib/explorer-resolver';
import { AssetMath } from '../src/lib/asset-math';
import { DeepEqual } from '../src/lib/deep-equal';
import { CurrencyFormatter } from '../src/lib/currency-formatter';
import { IpfsUrlResolver } from '../src/lib/ipfs-url';
import { StatusStyles } from '../src/lib/status-styles';
import { OptimisticStateContainer } from '../src/lib/optimistic-state';
import { ProgressCalculator } from '../src/lib/progress-calc';

describe('Batch 12 Codebase & Engineering Tests', () => {
  it('TypedContractBuilder: builds valid ScVal parameters', () => {
    const args = TypedContractBuilder.buildReleaseArgs(1, 0);
    assert.equal(args.length, 2);
  });

  it('ErrorClassificationMap: classifies known error codes', () => {
    const c = ErrorClassificationMap.classify(24);
    assert.equal(c.severity, 'WARN');
    assert.ok(c.message.includes('1 hour'));
  });

  it('TimelineNormalizer: maps and sorts timeline events', () => {
    const events = [
      { type: 'MilestoneApproved', timestamp: 200 },
      { type: 'AgreementCreated', timestamp: 100 },
    ];
    const norm = TimelineNormalizer.normalize(events);
    assert.equal(norm[0].type, 'MilestoneApproved');
    assert.equal(norm[0].label, 'Milestone Released');
  });

  it('SimulationInspector: parses cost and resource fees', () => {
    const sim = SimulationInspector.inspect({ minResourceFee: '150', cost: { cpuInsns: 1000 } });
    assert.equal(sim.success, true);
    assert.equal(sim.minResourceFee, '150');
  });

  it('ExplorerResolver: builds valid Stellar Expert URLs', () => {
    const url = ExplorerResolver.getTxUrl('abc123hash', 'TESTNET');
    assert.ok(url.includes('testnet/tx/abc123hash'));
  });

  it('AssetMath: converts decimal and stroop values with precision', () => {
    assert.equal(AssetMath.stroopToDecimal(15_000_000n), '1.5');
    assert.equal(AssetMath.decimalToStroop('1.5'), 15_000_000n);
  });

  it('DeepEqual: detects structural object equality', () => {
    assert.equal(DeepEqual.isEqual({ a: [1, 2] }, { a: [1, 2] }), true);
    assert.equal(DeepEqual.isEqual({ a: 1 }, { a: 2 }), false);
  });

  it('CurrencyFormatter: formats numbers with compact notation', () => {
    assert.equal(CurrencyFormatter.format(1500000, 'XLM', true), '1.5M XLM');
    assert.equal(CurrencyFormatter.format(2500, 'USDC', true), '2.5K USDC');
  });

  it('IpfsUrlResolver: handles IPFS CIDs and prefixes', () => {
    const url = IpfsUrlResolver.toGatewayUrl('ipfs://bafybeic5');
    assert.ok(url.startsWith('https://ipfs.io/ipfs/bafybeic5'));
  });

  it('StatusStyles: maps milestone statuses to UI tokens', () => {
    const style = StatusStyles.getMilestoneBadge('APPROVED');
    assert.equal(style.label, 'Approved');
    assert.ok(style.text.includes('emerald'));
  });

  it('OptimisticStateContainer: applies and rolls back updates', () => {
    const cont = new OptimisticStateContainer({ count: 0 });
    const rollback = cont.applyOptimistic(s => ({ count: s.count + 1 }));
    assert.equal(cont.get().count, 1);
    rollback();
    assert.equal(cont.get().count, 0);
  });

  it('ProgressCalculator: calculates percentage completion accurately', () => {
    const milestones = [
      { status: 'APPROVED', amount: 50 },
      { status: 'PENDING', amount: 50 },
    ];
    assert.equal(ProgressCalculator.calculate(milestones), 50);
  });
});
