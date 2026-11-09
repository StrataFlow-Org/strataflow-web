export function isInlineScriptAllowed(): boolean {
  if (typeof document === 'undefined') return true;
  // Verify CSP policy meta tag or script presence
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  return !cspMeta || cspMeta.getAttribute('content')?.includes("'unsafe-inline'") === false;
}

export function sanitizeHtmlAttributes(input: string): string {
  return input.replace(/[\"'>]/g, '');
}
