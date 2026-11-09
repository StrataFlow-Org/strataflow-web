export class AriaLiveAnnouncer {
  private static liveElement: HTMLElement | null = null;

  public static init(): void {
    if (typeof document === 'undefined') return;
    if (!this.liveElement) {
      this.liveElement = document.createElement('div');
      this.liveElement.id = 'strataflow-aria-live';
      this.liveElement.setAttribute('aria-live', 'polite');
      this.liveElement.setAttribute('aria-atomic', 'true');
      this.liveElement.className = 'sr-only';
      document.body.appendChild(this.liveElement);
    }
  }

  public static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof document === 'undefined') return;
    this.init();
    if (this.liveElement) {
      this.liveElement.setAttribute('aria-live', priority);
      this.liveElement.textContent = message;
    }
  }
}
