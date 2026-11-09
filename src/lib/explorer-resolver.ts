export class ExplorerResolver {
  public static getTxUrl(txHash: string, network: string = 'TESTNET'): string {
    const isTestnet = network.toUpperCase().includes('TEST');
    const net = isTestnet ? 'testnet' : 'public';
    return `https://stellar.expert/explorer/${net}/tx/${txHash}`;
  }

  public static getAccountUrl(account: string, network: string = 'TESTNET'): string {
    const isTestnet = network.toUpperCase().includes('TEST');
    const net = isTestnet ? 'testnet' : 'public';
    return `https://stellar.expert/explorer/${net}/account/${account}`;
  }

  public static getContractUrl(contractId: string, network: string = 'TESTNET'): string {
    const isTestnet = network.toUpperCase().includes('TEST');
    const net = isTestnet ? 'testnet' : 'public';
    return `https://stellar.expert/explorer/${net}/contract/${contractId}`;
  }
}
