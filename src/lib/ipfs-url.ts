export class IpfsUrlResolver {
  public static readonly DEFAULT_GATEWAY = 'https://ipfs.io/ipfs/';

  public static readonly REDUNDANT_GATEWAYS: readonly string[] = [
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://dweb.link/ipfs/',
  ];

  public static toGatewayUrl(uri: string, gateway: string = this.DEFAULT_GATEWAY): string {
    if (!uri) return '';
    const cleanUri = uri.trim();
    if (cleanUri.startsWith('ipfs://')) {
      const cid = cleanUri.replace('ipfs://', '');
      return `${gateway.replace(/\/$/, '')}/${cid}`;
    }
    if (/^(Qm[1-9A-HJ-NP-Za-km-z]{10,}|bafy[a-z0-9]{5,})$/.test(cleanUri)) {
      return `${gateway.replace(/\/$/, '')}/${cleanUri}`;
    }
    return cleanUri;
  }

  public static getFallbackGatewayUrls(uri: string): string[] {
    if (!uri) return [];
    const cleanUri = uri.trim();
    if (cleanUri.startsWith('http://') || cleanUri.startsWith('https://')) {
      return [cleanUri];
    }
    return this.REDUNDANT_GATEWAYS.map((gw) => this.toGatewayUrl(cleanUri, gw));
  }
}
