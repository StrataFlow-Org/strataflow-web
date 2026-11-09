export class RpcWhitelist {
  private static readonly ALLOWED_HOSTS = new Set([
    'soroban-testnet.stellar.org',
    'horizon-testnet.stellar.org',
    'soroban-futurenet.stellar.org',
    'horizon-futurenet.stellar.org',
    'mainnet.sorobanrpc.com',
    'horizon.stellar.org',
    'localhost',
    '127.0.0.1',
  ]);

  public static isWhitelisted(urlString: string): boolean {
    try {
      const parsed = new URL(urlString);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return false;
      }
      return this.ALLOWED_HOSTS.has(parsed.hostname);
    } catch {
      return false;
    }
  }
}
