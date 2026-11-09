export class ProgressCalculator {
  public static calculate(milestones: Array<{ status: string; amount: number | bigint }>): number {
    if (!milestones || milestones.length === 0) return 0;
    let completedAmount = 0n;
    let totalAmount = 0n;

    for (const m of milestones) {
      const amt = BigInt(m.amount);
      totalAmount += amt;
      if (m.status.toUpperCase() === 'APPROVED') {
        completedAmount += amt;
      }
    }

    if (totalAmount === 0n) return 0;
    return Math.round(Number((completedAmount * 100n) / totalAmount));
  }
}
