export class PhishingFilterService {
  private static knownSuspiciousHosts = new Set<string>([
    'stellar-airdrop.claim.org',
    'freestroops.com',
    'wallet-restore-stellar.net',
    'stellar-drop.info',
  ]);

  public static isSuspiciousHost(urlStr: string): boolean {
    try {
      const parsed = new URL(urlStr);
      return this.knownSuspiciousHosts.has(parsed.hostname.toLowerCase());
    } catch {
      return false;
    }
  }

  public static addSuspiciousHost(host: string): void {
    this.knownSuspiciousHosts.add(host.toLowerCase());
  }
}
