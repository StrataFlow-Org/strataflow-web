export interface AnchorConfig {
  domain: string;
  name: string;
  sep24Url: string;
  sep38Url?: string;
  supportedAssets: string[];
}

export const KNOWN_ANCHORS: Record<string, AnchorConfig> = {
  CIRCLE_USDC: {
    domain: 'circle.com',
    name: 'Circle Financial (USDC)',
    sep24Url: 'https://api.circle.com/v1/w3s/stellar/sep24',
    supportedAssets: ['USDC'],
  },
  SDF_TEST_ANCHOR: {
    domain: 'testanchor.stellar.org',
    name: 'SDF Reference Test Anchor',
    sep24Url: 'https://testanchor.stellar.org/sep24',
    sep38Url: 'https://testanchor.stellar.org/sep38',
    supportedAssets: ['USDC', 'SRT'],
  },
};

export class StellarAnchorService {
  public static getAnchorForAsset(assetCode: string, isTestnet: boolean = true): AnchorConfig | null {
    if (assetCode.toUpperCase() === 'USDC') {
      return isTestnet ? KNOWN_ANCHORS.SDF_TEST_ANCHOR : KNOWN_ANCHORS.CIRCLE_USDC;
    }
    return null;
  }

  public static buildDepositUrl(
    anchor: AnchorConfig,
    assetCode: string,
    accountPublicKey: string
  ): string {
    const params = new URLSearchParams({
      asset_code: assetCode,
      account: accountPublicKey,
      lang: 'en',
    });

    return `${anchor.sep24Url}/transactions/deposit/interactive?${params.toString()}`;
  }
}

