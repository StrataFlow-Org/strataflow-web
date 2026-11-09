export class SecureSessionManager {
  private static readonly STORAGE_KEYS = [
    'strataflow_auth_token',
    'strataflow_user_address',
    'strataflow_session_exp',
    'strataflow_recent_txs',
  ];

  public static clearSession(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    for (const key of this.STORAGE_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
    }
    if (window.sessionStorage) {
      try {
        sessionStorage.clear();
      } catch {
        // ignore
      }
    }
  }

  public static isSessionActive(expiryMs?: number): boolean {
    if (!expiryMs) return false;
    return Date.now() < expiryMs;
  }
}
