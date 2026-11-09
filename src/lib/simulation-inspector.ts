export interface SimulationResult {
  success: boolean;
  minResourceFee?: string;
  cpuInstructions?: number;
  memoryBytes?: number;
  error?: string;
}

export class SimulationInspector {
  public static inspect(simResponse: any): SimulationResult {
    if (!simResponse) {
      return { success: false, error: 'Empty simulation response' };
    }
    if (simResponse.error) {
      return { success: false, error: simResponse.error };
    }
    return {
      success: true,
      minResourceFee: simResponse.minResourceFee || '100',
      cpuInstructions: simResponse.cost?.cpuInsns || 0,
      memoryBytes: simResponse.cost?.memBytes || 0,
    };
  }
}
