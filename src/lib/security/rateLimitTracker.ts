export class ClientRateLimiter {
  private lastCallTimes: number[] = [];
  private maxCalls: number;
  private windowMs: number;

  constructor(maxCalls = 10, windowMs = 5000) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
  }

  public allowRequest(): boolean {
    const now = Date.now();
    this.lastCallTimes = this.lastCallTimes.filter((t) => now - t < this.windowMs);

    if (this.lastCallTimes.length >= this.maxCalls) {
      return false;
    }

    this.lastCallTimes.push(now);
    return true;
  }
}
