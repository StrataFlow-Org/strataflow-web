export interface DisputeEvidencePackage {
  agreementId: string | number;
  claimantPublicKey: string;
  reason: string;
  timestamp: number;
  evidenceUri?: string;
  signatureDigest: string;
}

export function assembleDisputeEvidencePackage(
  agreementId: string | number,
  claimantPublicKey: string,
  reason: string,
  evidenceUri?: string
): DisputeEvidencePackage {
  const timestamp = Date.now();
  const rawPayload = `${agreementId}:${claimantPublicKey}:${reason}:${timestamp}:${evidenceUri ?? ''}`;

  // Simple deterministic digest representation for arbitration package
  let hash = 0;
  for (let i = 0; i < rawPayload.length; i++) {
    hash = (hash << 5) - hash + rawPayload.charCodeAt(i);
    hash |= 0;
  }
  const signatureDigest = `sig_0x${Math.abs(hash).toString(16).padStart(8, '0')}`;

  return {
    agreementId,
    claimantPublicKey,
    reason,
    timestamp,
    evidenceUri,
    signatureDigest,
  };
}
