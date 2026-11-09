export class TimingUtils {
  public static debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number): (...args: Parameters<T>) => void {
    let timer: any = null;
    return (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delayMs);
    };
  }

  public static throttle<T extends (...args: any[]) => void>(fn: T, limitMs: number): (...args: Parameters<T>) => void {
    let lastRan = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRan >= limitMs) {
        fn(...args);
        lastRan = now;
      }
    };
  }
}
