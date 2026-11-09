export function isValidSha256Hex(hash: string): boolean {
  if (typeof hash !== 'string') return false;
  return /^[a-fA-F0-9]{64}$/.test(hash);
}

export function isValidIpfsCid(cid: string): boolean {
  if (typeof cid !== 'string') return false;
  // Accepts CIDv0 (Qm...) or CIDv1 (bafy...) or ipfs:// prefix
  return /^(ipfs:\/\/)?(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{55})$/.test(cid);
}
