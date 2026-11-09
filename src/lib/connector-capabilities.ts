export interface WalletCapabilities {
  supportsSoroban: boolean;
  supportsSimulate: boolean;
  name: string;
}

export class ConnectorCapabilities {
  public static getCapabilities(connectorName: string = 'freighter'): WalletCapabilities {
    return {
      name: connectorName,
      supportsSoroban: true,
      supportsSimulate: true,
    };
  }
}
