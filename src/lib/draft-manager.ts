export class DraftManager {
  private static readonly KEY = 'strataflow_draft_agreement';

  public static saveDraft(draft: any): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      sessionStorage.setItem(this.KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }

  public static loadDraft(): any | null {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    try {
      const data = sessionStorage.getItem(this.KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public static clearDraft(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      sessionStorage.removeItem(this.KEY);
    } catch {
      // ignore
    }
  }
}
