import { STELLAR_CONFIG } from './stellar';

export interface HorizonBalanceLine {
  asset_type: 'native' | 'credit_alphanum4' | 'credit_alphanum12';
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

export interface HorizonAccountData {
  id: string;
  sequence: string;
  balances: HorizonBalanceLine[];
  subentry_count: number;
}

export class HorizonFallbackService {
  private horizonUrl: string;

  constructor(horizonUrl?: string) {
    this.horizonUrl = horizonUrl || STELLAR_CONFIG.horizonUrl;
  }

  public async fetchAccount(publicKey: string): Promise<HorizonAccountData | null> {
    try {
      const res = await fetch(`${this.horizonUrl}/accounts/${publicKey}`, {
        headers: { Accept: 'application/json' },
      });

      if (res.status === 404) {
        return null;
      }

      if (!res.ok) {
        throw new Error(`Horizon account query returned HTTP ${res.status}`);
      }

      const json = await res.json();
      return {
        id: json.id,
        sequence: json.sequence,
        balances: json.balances || [],
        subentry_count: json.subentry_count || 0,
      };
    } catch {
      return null;
    }
  }

  public async getNativeBalance(publicKey: string): Promise<string> {
    const account = await this.fetchAccount(publicKey);
    if (!account) return '0';

    const nativeLine = account.balances.find((b) => b.asset_type === 'native');
    return nativeLine ? nativeLine.balance : '0';
  }

  public async getAssetBalance(
    publicKey: string,
    assetCode: string,
    assetIssuer?: string
  ): Promise<string> {
    const account = await this.fetchAccount(publicKey);
    if (!account) return '0';

    const line = account.balances.find(
      (b) =>
        b.asset_code === assetCode &&
        (!assetIssuer || b.asset_issuer === assetIssuer)
    );
    return line ? line.balance : '0';
  }
}

export const horizonFallback = new HorizonFallbackService();

