export type StellarNetworkId = 'TESTNET' | 'MAINNET' | 'FUTURENET';

export interface NetworkConfig {
  id: StellarNetworkId;
  name: string;
  passphrase: string;
  horizonUrl: string;
  rpcUrl: string;
  contractId: string;
  isTestnet: boolean;
  explorerUrl: string;
}

export const NETWORKS: Record<StellarNetworkId, NetworkConfig> = {
  TESTNET: {
    id: 'TESTNET',
    name: 'Stellar Testnet',
    passphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
    contractId: process.env.NEXT_PUBLIC_STRATAFLOW_CONTRACT_ID || 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM',
    isTestnet: true,
    explorerUrl: 'https://stellar.expert/explorer/testnet',
  },
  FUTURENET: {
    id: 'FUTURENET',
    name: 'Stellar Futurenet',
    passphrase: 'Test SDF Future Network ; October 2022',
    horizonUrl: 'https://horizon-futurenet.stellar.org',
    rpcUrl: 'https://rpc-futurenet.stellar.org',
    contractId: process.env.NEXT_PUBLIC_STRATAFLOW_CONTRACT_ID || '',
    isTestnet: true,
    explorerUrl: 'https://stellar.expert/explorer/futurenet',
  },
  MAINNET: {
    id: 'MAINNET',
    name: 'Stellar Mainnet',
    passphrase: 'Public Global Stellar Network ; July 2015',
    horizonUrl: 'https://horizon.stellar.org',
    rpcUrl: 'https://soroban-rpc.mainnet.stellar.org',
    contractId: process.env.NEXT_PUBLIC_STRATAFLOW_CONTRACT_ID || '',
    isTestnet: false,
    explorerUrl: 'https://stellar.expert/explorer/public',
  },
};

export function getActiveNetwork(networkId?: string): NetworkConfig {
  let normalized = (networkId || process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET').toUpperCase();
  if (normalized === 'PUBLIC') normalized = 'MAINNET';
  const target = normalized as StellarNetworkId;
  return NETWORKS[target] || NETWORKS.TESTNET;
}

export function getExplorerTxUrl(txHash: string, networkId?: string): string {
  const net = getActiveNetwork(networkId);
  return `${net.explorerUrl}/tx/${txHash}`;
}

export function getExplorerAccountUrl(address: string, networkId?: string): string {
  const net = getActiveNetwork(networkId);
  return `${net.explorerUrl}/account/${address}`;
}

export function getExplorerContractUrl(contractId: string, networkId?: string): string {
  const net = getActiveNetwork(networkId);
  return `${net.explorerUrl}/contract/${contractId}`;
}
