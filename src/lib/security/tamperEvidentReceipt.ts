export interface EscrowReceipt {
  agreementId: string | number;
  title: string;
  totalAmountStroops: string;
  client: string;
  provider: string;
  tokenAddress: string;
  ledgerSequence?: number;
  txHash?: string;
  issuedAt: string;
  receiptChecksum: string;
}

export function generateTamperEvidentReceipt(
  agreement: {
    id: string | number;
    title: string;
    totalAmount: number;
    client: string;
    provider: string;
    tokenAddress: string;
  },
  ledgerSeq = 1000,
  txHash = '0x123'
): EscrowReceipt {
  const issuedAt = new Date().toISOString();
  const totalAmountStroops = (BigInt(agreement.totalAmount) * 10_000_000n).toString();
  const rawData = `${agreement.id}|${agreement.title}|${totalAmountStroops}|${agreement.client}|${agreement.provider}|${ledgerSeq}|${txHash}|${issuedAt}`;

  let hash = 0;
  for (let i = 0; i < rawData.length; i++) {
    hash = (hash << 5) - hash + rawData.charCodeAt(i);
    hash |= 0;
  }
  const receiptChecksum = `rcpt_${Math.abs(hash).toString(16)}`;

  return {
    agreementId: agreement.id,
    title: agreement.title,
    totalAmountStroops,
    client: agreement.client,
    provider: agreement.provider,
    tokenAddress: agreement.tokenAddress,
    ledgerSequence: ledgerSeq,
    txHash,
    issuedAt,
    receiptChecksum,
  };
}
