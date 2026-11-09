export function compareProofHashes(expectedHash: string, submittedHash: string): boolean {
  if (!expectedHash || !submittedHash) return false;
  const cleanExp = expectedHash.trim().toLowerCase().replace(/^ipfs:\/\//, '');
  const cleanSub = submittedHash.trim().toLowerCase().replace(/^ipfs:\/\//, '');
  return cleanExp === cleanSub;
}

export function formatProofDisplay(hash: string): string {
  if (!hash) return '';
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}
