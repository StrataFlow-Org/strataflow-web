export function encodeDraftPayload(payload: Record<string, any>): string {
  try {
    const jsonStr = JSON.stringify(payload);
    // Base64 obfuscation wrapper for client-side drafts
    if (typeof btoa !== 'undefined') {
      return btoa(encodeURIComponent(jsonStr));
    }
    return Buffer.from(jsonStr).toString('base64');
  } catch {
    return '';
  }
}

export function decodeDraftPayload<T = Record<string, any>>(encoded: string): T | null {
  try {
    let jsonStr = '';
    if (typeof atob !== 'undefined') {
      jsonStr = decodeURIComponent(atob(encoded));
    } else {
      jsonStr = Buffer.from(encoded, 'base64').toString('utf-8');
    }
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}
