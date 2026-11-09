export interface HealthPingResult {
  reachable: boolean;
  latencyMs: number;
  error?: string;
}

export class RpcHealthMonitor {
  public static async pingEndpoint(url: string, timeoutMs: number = 3000): Promise<HealthPingResult> {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timer);

      const latencyMs = Date.now() - start;
      return {
        reachable: res.ok || res.status < 500,
        latencyMs,
      };
    } catch (err: any) {
      return {
        reachable: false,
        latencyMs: Date.now() - start,
        error: err.message || 'Network unreachable',
      };
    }
  }
}
