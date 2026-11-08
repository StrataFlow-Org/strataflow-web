const SESSION_TOKEN_KEY = 'strataflow_auth_token';

export interface DecodedSession {
  sub: string;
  iat: number;
  exp: number;
  iss: string;
}

export function saveSessionToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch (err) {
    console.warn('Failed to save session token:', err);
  }
}

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearSessionToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to clear session token:', err);
  }
}

export function decodeSessionToken(token: string): DecodedSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isSessionValid(): boolean {
  const token = getSessionToken();
  if (!token) return false;

  const session = decodeSessionToken(token);
  if (!session) return false;

  const now = Math.floor(Date.now() / 1000);
  return session.exp > now;
}

export function getSessionAddress(): string | null {
  const token = getSessionToken();
  if (!token) return null;
  const session = decodeSessionToken(token);
  return session?.sub || null;
}

