export class WalletRetryHandler {
  public static async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    initialDelayMs: number = 200
  ): Promise<T> {
    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        if (attempt >= maxAttempts) throw err;
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error('Wallet retry attempts exhausted');
  }
}
