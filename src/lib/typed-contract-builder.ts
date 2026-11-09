import { nativeToScVal, Address } from '@stellar/stellar-sdk';

export class TypedContractBuilder {
  public static buildReleaseArgs(agreementId: number | bigint, milestoneIdx: number): any[] {
    return [
      nativeToScVal(BigInt(agreementId), { type: 'u64' }),
      nativeToScVal(milestoneIdx, { type: 'u32' }),
    ];
  }

  public static buildDisputeArgs(agreementId: number | bigint, clientPayout: bigint, providerPayout: bigint): any[] {
    return [
      nativeToScVal(BigInt(agreementId), { type: 'u64' }),
      nativeToScVal(clientPayout, { type: 'i128' }),
      nativeToScVal(providerPayout, { type: 'i128' }),
    ];
  }
}
