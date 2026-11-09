export class IpfsUrlResolver {
  public static readonly DEFAULT_GATEWAY = 'https://ipfs.io/ipfs/';

  public static toGatewayUrl(uri: string, gateway: string = this.DEFAULT_GATEWAY): string {
    if (!uri) return '';
    if (uri.startsWith('ipfs://')) {
      return `${gateway}${uri.replace('ipfs://', '')}`;
    }
    if (/^(Qm[1-9A-HJ-NP-za-km-z]{44}|bafy[a-z0-9]{55})$/.test(uri)) {
      return `${gateway}${uri}`;
    }
    return uri;
  }
}
