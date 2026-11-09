export function maskStellarAddress(address: string): string {
  if (!address || address.length < 10) return 'G...';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function anonymizeAgreementForExport<T extends { client: string; provider: string; arbiter?: string }>(agreement: T): T {
  return {
    ...agreement,
    client: maskStellarAddress(agreement.client),
    provider: maskStellarAddress(agreement.provider),
    ...(agreement.arbiter ? { arbiter: maskStellarAddress(agreement.arbiter) } : {}),
  };
}
