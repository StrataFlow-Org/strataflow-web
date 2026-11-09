export class SessionStateVault {
  private static ephemeralMap = new Map<string, string>();

  public static setEphemeralItem(key: string, value: string): void {
    this.ephemeralMap.set(key, value);
  }

  public static getEphemeralItem(key: string): string | null {
    return this.ephemeralMap.get(key) ?? null;
  }

  public static deleteEphemeralItem(key: string): void {
    this.ephemeralMap.delete(key);
  }

  public static clearAll(): void {
    this.ephemeralMap.clear();
  }
}
