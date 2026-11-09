import { StrKey } from '@stellar/stellar-sdk';

export class WalletGuard {
  public static isValidPublicKey(key: string): boolean {
    if (!key || typeof key !== 'string' || key.length !== 56) return false;
    return StrKey.isValidEd25519PublicKey(key);
  }

  public static isValidContractAddress(contractId: string): boolean {
    if (!contractId || typeof contractId !== 'string' || contractId.length !== 56) return false;
    return StrKey.isValidContract(contractId);
  }

  public static sanitizeAddress(address: string): string {
    return (address || '').trim().toUpperCase();
  }
}
