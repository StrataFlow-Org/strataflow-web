export interface TokenConfig {
  code: string;
  name: string;
  contractId: string;
  decimals: number;
  isNative: boolean;
  icon?: string;
}

export const SUPPORTED_TOKENS: Record<string, TokenConfig> = {
  XLM: {
    code: 'XLM',
    name: 'Native Lumens',
    contractId: 'CDLZ73VU7Y4Z45ETK26QU62NDXQJ2277NY2Y57C2ZFU7SS7M6HWT7G4H', // SAC Native on Testnet
    decimals: 7,
    isNative: true,
  },
  USDC: {
    code: 'USDC',
    name: 'Circle USD Coin (Testnet)',
    contractId: 'CBIELTK6YBZJU5UP2WWQEUCYJLPU6QXNRA3BQARXQWDCW27SIOV4EUSC', // Standard SAC USDC testnet
    decimals: 7,
    isNative: false,
  },
};

export function getTokenConfig(codeOrAddress: string): TokenConfig {
  const upper = codeOrAddress.toUpperCase();
  if (SUPPORTED_TOKENS[upper]) {
    return SUPPORTED_TOKENS[upper];
  }

  // Fallback for custom SAC token contract address
  return {
    code: 'CUSTOM',
    name: 'Custom SAC Token',
    contractId: codeOrAddress,
    decimals: 7,
    isNative: false,
  };
}
