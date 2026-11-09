export class ClipboardHelper {
  public static async copyText(text: string): Promise<boolean> {
    if (!text) return false;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback below
      }
    }
    return false;
  }
}
