export interface NormalizedTimelineEvent {
  id: string;
  type: string;
  label: string;
  timestamp: number;
  actor?: string;
  txHash?: string;
}

export class TimelineNormalizer {
  public static normalize(rawEvents: any[]): NormalizedTimelineEvent[] {
    return rawEvents
      .map(ev => ({
        id: ev.id || `${ev.txHash || 'tx'}_${ev.type}`,
        type: ev.type,
        label: this.formatLabel(ev.type),
        timestamp: ev.timestamp || Date.now(),
        actor: ev.actor,
        txHash: ev.txHash,
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  private static formatLabel(type: string): string {
    switch (type) {
      case 'AgreementCreated': return 'Agreement Created';
      case 'AgreementFunded': return 'Escrow Funded';
      case 'MilestoneApproved': return 'Milestone Released';
      case 'DisputeRaised': return 'Dispute Opened';
      case 'DisputeResolved': return 'Dispute Resolved';
      default: return type;
    }
  }
}
