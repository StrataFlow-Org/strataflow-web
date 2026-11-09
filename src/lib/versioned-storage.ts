export interface CacheEnvelope<T> {
  version: number;
  data: T;
  expiresAt: number;
}

export class VersionedStorage {
  public static readonly CURRENT_VERSION = 1;

  public static set<T>(key: string, data: T, ttlMs: number = 3600000): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const envelope: CacheEnvelope<T> = {
      version: this.CURRENT_VERSION,
      data,
      expiresAt: Date.now() + ttlMs,
    };
    try {
      localStorage.setItem(key, JSON.stringify(envelope));
    } catch {
      // Storage full or unavailable
    }
  }

  public static get<T>(key: string): T | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed: CacheEnvelope<T> = JSON.parse(raw);
      if (parsed.version !== this.CURRENT_VERSION || Date.now() > parsed.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }
}
