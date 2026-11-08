import { StrKey } from '@stellar/stellar-sdk';

export const STELLAR_CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET',
  rpcUrl: process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  contractId:
    process.env.NEXT_PUBLIC_STRATAFLOW_CONTRACT_ID ||
    'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM',
  networkPassphrase:
    process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
    'Test SDF Network ; September 2015',
};

/**
 * Validates whether a string is a valid Stellar Ed25519 Public Key (G...)
 */
export function isValidStellarAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  try {
    return StrKey.isValidEd25519PublicKey(address.trim());
  } catch {
    return false;
  }
}

/**
 * Validates whether a string is a valid Soroban Contract Address (C...)
 */
export function isValidContractAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  try {
    return StrKey.isValidContract(address.trim());
  } catch {
    return false;
  }
}

/**
 * Validates whether a string is either a valid Account (G...) or Contract (C...)
 */
export function isValidStellarOrContractAddress(address: string): boolean {
  return isValidStellarAddress(address) || isValidContractAddress(address);
}

/**
 * Truncates a Stellar address with ellipsis: GABC...WXYZ
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  const trimmed = address.trim();
  if (trimmed.length <= chars * 2 + 3) return trimmed;
  return `${trimmed.substring(0, chars)}...${trimmed.substring(trimmed.length - chars)}`;
}
