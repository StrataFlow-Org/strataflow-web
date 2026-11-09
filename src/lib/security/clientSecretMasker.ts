export function maskSecret(secret: string): string {
  if (!secret || secret.length < 8) return '********';
  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}

export function maskObjectSecrets<T extends Record<string, any>>(obj: T): T {
  const sensitiveKeys = ['secret', 'seed', 'privateKey', 'password', 'token', 'auth'];
  const sanitized: Record<string, any> = { ...obj };

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = maskSecret(sanitized[key]);
      }
    }
  }

  return sanitized as T;
}
