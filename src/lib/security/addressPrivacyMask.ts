export type PrivacyMode = 'TRUNCATED' | 'ANONYMIZED' | 'FULL';

export function formatAddressWithPrivacy(address: string, mode: PrivacyMode = 'TRUNCATED'): string {
  if (!address) return '';
  if (mode === 'FULL') return address;
  if (mode === 'ANONYMIZED') {
    return 'G***...****';
  }
  // TRUNCATED
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
