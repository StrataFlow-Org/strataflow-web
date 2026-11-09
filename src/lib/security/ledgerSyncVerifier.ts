export interface LedgerSyncComparison {
  isSynced: boolean;
  localLedgerSeq: number;
  networkLedgerSeq: number;
  lagBlocks: number;
}

export function compareLedgerSequences(localSeq: number, networkSeq: number): LedgerSyncComparison {
  const lag = Math.max(0, networkSeq - localSeq);
  return {
    isSynced: lag <= 2,
    localLedgerSeq: localSeq,
    networkLedgerSeq: networkSeq,
    lagBlocks: lag,
  };
}
