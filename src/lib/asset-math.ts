export class AssetMath {
  public static readonly STROOP_FACTOR = 10_000_000n;

  public static stroopToDecimal(stroops: bigint | string | number): string {
    const val = BigInt(stroops);
    const whole = val / this.STROOP_FACTOR;
    const frac = val % this.STROOP_FACTOR;
    if (frac === 0n) return whole.toString();
    const fracStr = frac.toString().padStart(7, '0').replace(/0+$/, '');
    return `${whole}.${fracStr}`;
  }

  public static decimalToStroop(decimalStr: string): bigint {
    const parts = decimalStr.trim().split('.');
    const whole = BigInt(parts[0] || '0') * this.STROOP_FACTOR;
    if (parts.length < 2) return whole;
    const fracStr = parts[1].padEnd(7, '0').slice(0, 7);
    return whole + BigInt(fracStr);
  }
}
