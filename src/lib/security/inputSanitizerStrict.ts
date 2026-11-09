export function sanitizeUserInputStrict(input: string): string {
  if (!input) return '';

  return input
    .replace(/<script[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/[<>]/g, (char) => (char === '<' ? '&lt;' : '&gt;'))
    .trim();
}

export function isValidMetadataDescription(desc: string): boolean {
  return typeof desc === 'string' && desc.length >= 3 && desc.length <= 1000;
}
