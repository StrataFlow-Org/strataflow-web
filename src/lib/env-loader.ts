export class EnvLoader {
  public static getContractId(env: Record<string, string | undefined> = process.env): string {
    return (
      env.NEXT_PUBLIC_STRATAFLOW_CONTRACT_ID ||
      'CDXVD3AA43SE2D52ZBJSH3RDKAPOYG6OCDAZGSQD6M5TCBQIG3HTLY6J'
    );
  }

  public static getNetwork(env: Record<string, string | undefined> = process.env): string {
    return env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET';
  }
}
