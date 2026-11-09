export class ClientNonceGenerator {
  public static generateNonce(byteLength: number = 16): string {
    const bytes = new Uint8Array(byteLength);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(bytes);
    } else {
      const crypto = require('crypto');
      const random = crypto.randomBytes(byteLength);
      return random.toString('hex');
    }
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public static isValidNonce(nonce: string, expectedLength: number = 32): boolean {
    return typeof nonce === 'string' && nonce.length === expectedLength && /^[a-fA-F0-9]+$/.test(nonce);
  }
}
