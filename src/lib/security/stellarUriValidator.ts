export function isValidStellarUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') return false;

  // SEP-0007 URI scheme: web+stellar:pay?... or web+stellar:tx?...
  const stellarUriPattern = /^web\+stellar:(pay|tx)\?[a-zA-Z0-9_=&%-]+$/;
  return stellarUriPattern.test(uri);
}

export function sanitizeRedirectTarget(targetUrl: string, allowedOrigins: string[]): string | null {
  try {
    const parsed = new URL(targetUrl);
    if (allowedOrigins.includes(parsed.origin)) {
      return targetUrl;
    }
  } catch {
    // Relative safe path check
    if (targetUrl.startsWith('/') && !targetUrl.startsWith('//')) {
      return targetUrl;
    }
  }
  return null;
}
