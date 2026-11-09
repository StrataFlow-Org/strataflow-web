export class CurrencyFormatter {
  public static format(amount: number | string, assetCode: string = 'XLM', compact: boolean = false): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return `0 ${assetCode}`;

    if (compact && num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M ${assetCode}`;
    }
    if (compact && num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K ${assetCode}`;
    }

    return `${num.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${assetCode}`;
  }
}
