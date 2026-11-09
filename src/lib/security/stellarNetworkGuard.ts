export class StellarNetworkGuard {
  public static assertNetworkMatch(expectedNetwork: string, targetNetwork: string): void {
    if (expectedNetwork.toUpperCase() !== targetNetwork.toUpperCase()) {
      throw new Error(
        `Network Guard Exception: Refusing to submit transaction built for ${expectedNetwork} to ${targetNetwork}`
      );
    }
  }

  public static isSafeTestnetOperation(networkPassphrase: string): boolean {
    return networkPassphrase.includes('Test SDF Network');
  }
}
