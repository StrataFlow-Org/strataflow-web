export class ErrorClassificationMap {
  private static readonly CLASSIFICATIONS: Record<number, { severity: 'CRITICAL' | 'WARN' | 'INFO'; message: string }> = {
    1: { severity: 'WARN', message: 'Protocol has already been initialized.' },
    3: { severity: 'CRITICAL', message: 'Unauthorized: caller does not possess required role.' },
    4: { severity: 'WARN', message: 'Agreement not found.' },
    10: { severity: 'WARN', message: 'Agreement deadline has passed.' },
    11: { severity: 'WARN', message: 'Dispute split amounts do not sum to escrow balance.' },
    13: { severity: 'CRITICAL', message: 'Protocol is temporarily paused.' },
    24: { severity: 'WARN', message: 'Agreement duration must be at least 1 hour.' },
  };

  public static classify(errorCode: number) {
    return this.CLASSIFICATIONS[errorCode] || { severity: 'WARN', message: `Contract error code ${errorCode}` };
  }
}
