export async function writeSecureClipboard(text: string, clearAfterMs = 30000): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(text);

    if (clearAfterMs > 0) {
      setTimeout(async () => {
        try {
          const current = await navigator.clipboard.readText();
          if (current === text) {
            await navigator.clipboard.writeText('');
          }
        } catch {
          // ignore
        }
      }, clearAfterMs);
    }

    return true;
  } catch {
    return false;
  }
}
