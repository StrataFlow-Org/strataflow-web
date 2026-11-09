export function purgeSensitiveClientStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    const sensitivePrefixes = ['strataflow_', 'stellar_', 'sep10_', 'session_'];
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && sensitivePrefixes.some((p) => key.startsWith(p))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    sessionStorage.clear();
  } catch {
    // Gracefully handle storage access restrictions
  }
}
