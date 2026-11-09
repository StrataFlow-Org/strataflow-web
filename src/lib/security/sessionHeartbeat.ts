export class SessionHeartbeatService {
  private timer: NodeJS.Timeout | null = null;
  private intervalMs: number;

  constructor(intervalMs = 60000) {
    this.intervalMs = intervalMs;
  }

  public start(onHeartbeat: () => Promise<void>): void {
    this.stop();
    this.timer = setInterval(async () => {
      try {
        await onHeartbeat();
      } catch {
        // fail silently
      }
    }, this.intervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
