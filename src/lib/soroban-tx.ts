import {
  rpc,
  TransactionBuilder,
  Account,
  Contract,
  xdr,
  nativeToScVal,
  scValToNative,
  Address,
} from '@stellar/stellar-sdk';
import { getActiveNetwork, StellarNetworkId } from './stellar-network';

export interface SorobanSimulationResult {
  isSuccess: boolean;
  minResourceFee?: string;
  result?: unknown;
  error?: string;
  assembledTransaction?: any;
}

export interface SorobanTxSubmissionResult {
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  hash: string;
  ledger?: number;
  returnValue?: unknown;
  error?: string;
}

export const STRATAFLOW_ERROR_MAP: Record<number, string> = {
  1: 'Smart contract instance has already been initialized',
  2: 'Smart contract instance is uninitialized',
  3: 'Caller address is unauthorized for this action',
  4: 'The requested agreement ID was not found in storage',
  5: 'The specified milestone configuration or index is invalid',
  6: 'Action is not permitted in the current agreement status',
  7: 'Milestone has not yet been submitted or approved',
  8: 'A dispute is already active on this agreement',
  9: 'Cannot resolve dispute because agreement is not currently disputed',
  10: 'Action rejected: agreement completion deadline has expired',
  11: 'Dispute apportionment does not equal total available balance',
  12: 'Milestone count exceeds maximum allowed limit (25)',
  13: 'Protocol is currently paused by admin circuit breaker',
  14: 'Milestones must be submitted sequentially in order',
  15: 'Timeout refund rejected: agreement deadline has not yet elapsed',
  16: 'Cannot cancel an agreement that has already been funded',
  17: 'Protocol fee basis points exceeds protocol maximum ceiling (10%)',
};

export class SorobanTxPipeline {
  private server: rpc.Server;
  private networkId: StellarNetworkId;

  constructor(networkId: StellarNetworkId = 'TESTNET') {
    this.networkId = networkId;
    const netConfig = getActiveNetwork(networkId);
    this.server = new rpc.Server(netConfig.rpcUrl);
  }

  public getServer(): rpc.Server {
    return this.server;
  }

  /**
   * Decodes custom Soroban error code into human-readable description
   */
  public static decodeErrorCode(errorNumber: number): string {
    return STRATAFLOW_ERROR_MAP[errorNumber] || `Contract error code: #${errorNumber}`;
  }

  /**
   * Builds raw contract invocation operation
   */
  public buildInvocation(contractId: string, method: string, args: xdr.ScVal[] = []): xdr.Operation {
    const contract = new Contract(contractId);
    return contract.call(method, ...args);
  }

  /**
   * Builds an un-signed transaction for contract invocation
   */
  public async buildTransaction(
    senderAddress: string,
    contractId: string,
    method: string,
    args: xdr.ScVal[] = []
  ) {
    const netConfig = getActiveNetwork(this.networkId);

    // Fetch account from RPC (returns an Account instance with sequence number)
    const sourceAccount = await this.server.getAccount(senderAddress);

    const tx = new TransactionBuilder(sourceAccount, {
      fee: '1000',
      networkPassphrase: netConfig.passphrase,
    })
      .addOperation(this.buildInvocation(contractId, method, args))
      .setTimeout(300)
      .build();

    return tx;
  }

  /**
   * Simulates a transaction against the Soroban RPC node
   */
  public async simulateTransaction(
    senderAddress: string,
    contractId: string,
    method: string,
    args: xdr.ScVal[] = []
  ): Promise<SorobanSimulationResult> {
    try {
      const tx = await this.buildTransaction(senderAddress, contractId, method, args);
      const simulation = await this.server.simulateTransaction(tx);

      if (rpc.Api.isSimulationError(simulation)) {
        return {
          isSuccess: false,
          error: simulation.error || 'Soroban transaction simulation failed',
        };
      }

      if (rpc.Api.isSimulationSuccess(simulation)) {
        let decodedResult: unknown = undefined;
        if (simulation.result?.retval) {
          try {
            decodedResult = scValToNative(simulation.result.retval);
          } catch {
            decodedResult = simulation.result.retval;
          }
        }

        const assembled = rpc.assembleTransaction(tx, simulation);

        return {
          isSuccess: true,
          minResourceFee: simulation.minResourceFee,
          result: decodedResult,
          assembledTransaction: assembled,
        };
      }

      return {
        isSuccess: false,
        error: 'Simulation returned unknown status',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error simulating transaction';
      return {
        isSuccess: false,
        error: msg,
      };
    }
  }

  /**
   * Submits a signed transaction and polls until final confirmation
   */
  public async submitAndPoll(
    signedTxXdr: string,
    maxWaitSeconds: number = 30
  ): Promise<SorobanTxSubmissionResult> {
    try {
      const tx = TransactionBuilder.fromXDR(
        signedTxXdr,
        getActiveNetwork(this.networkId).passphrase
      );

      const sendResponse = await this.server.sendTransaction(tx);

      if (sendResponse.status === 'ERROR') {
        return {
          status: 'FAILED',
          hash: sendResponse.hash,
          error: `RPC submission error: ${sendResponse.errorResult?.toXDR('base64') || 'Unknown RPC error'}`,
        };
      }

      const txHash = sendResponse.hash;
      const startTime = Date.now();
      const timeoutMs = maxWaitSeconds * 1000;

      while (Date.now() - startTime < timeoutMs) {
        await new Promise((r) => setTimeout(r, 1500));
        const statusResponse = await this.server.getTransaction(txHash);

        if (statusResponse.status === 'SUCCESS') {
          let returnValue: unknown = undefined;
          if (statusResponse.returnValue) {
            try {
              returnValue = scValToNative(statusResponse.returnValue);
            } catch {
              returnValue = statusResponse.returnValue;
            }
          }
          return {
            status: 'SUCCESS',
            hash: txHash,
            ledger: statusResponse.latestLedger,
            returnValue,
          };
        }

        if (statusResponse.status === 'FAILED') {
          return {
            status: 'FAILED',
            hash: txHash,
            ledger: statusResponse.latestLedger,
            error: 'On-chain transaction execution failed or reverted',
          };
        }
      }

      return {
        status: 'PENDING',
        hash: txHash,
        error: 'Transaction polling timed out; transaction may still finalize on-chain',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      return {
        status: 'FAILED',
        hash: '',
        error: msg,
      };
    }
  }

  // Contract specific argument builders
  public static encodeAddress(addr: string): xdr.ScVal {
    return new Address(addr).toScVal();
  }

  public static encodeU64(value: bigint | number | string): xdr.ScVal {
    return nativeToScVal(BigInt(value), { type: 'u64' });
  }

  public static encodeI128(value: bigint | number | string): xdr.ScVal {
    return nativeToScVal(BigInt(value), { type: 'i128' });
  }

  public static encodeSymbol(symbol: string): xdr.ScVal {
    return nativeToScVal(symbol, { type: 'symbol' });
  }

  public static encodeString(str: string): xdr.ScVal {
    return nativeToScVal(str, { type: 'string' });
  }

  public static encodeMilestone(m: {
    description: string;
    amount: bigint | string | number;
    proof_hash?: string;
    status?: number;
  }): xdr.ScVal {
    return xdr.ScVal.scvMap([
      new xdr.ScMapEntry({
        key: xdr.ScVal.scvSymbol('amount'),
        val: nativeToScVal(BigInt(m.amount), { type: 'i128' }),
      }),
      new xdr.ScMapEntry({
        key: xdr.ScVal.scvSymbol('description'),
        val: xdr.ScVal.scvString(m.description),
      }),
      new xdr.ScMapEntry({
        key: xdr.ScVal.scvSymbol('proof_hash'),
        val: xdr.ScVal.scvString(m.proof_hash || ''),
      }),
      new xdr.ScMapEntry({
        key: xdr.ScVal.scvSymbol('status'),
        val: nativeToScVal(m.status || 0, { type: 'u32' }),
      }),
    ]);
  }

  /**
   * Prepares arguments for create_agreement contract invocation:
   * create_agreement(client: Address, provider: Address, arbiter: Address, token: Address, milestones: Vec<Milestone>, deadline: u64)
   */
  public static buildCreateAgreementArgs(params: {
    client: string;
    provider: string;
    arbiter: string;
    token: string;
    totalAmount?: bigint | string;
    deadline: number;
    milestoneDescriptions: string[];
    milestoneAmounts: Array<bigint | string>;
  }): xdr.ScVal[] {
    const milestonesScVals = params.milestoneDescriptions.map((desc, idx) => {
      const amount = params.milestoneAmounts[idx] || 0n;
      return this.encodeMilestone({
        description: desc,
        amount,
        proof_hash: '',
        status: 0,
      });
    });

    return [
      this.encodeAddress(params.client),
      this.encodeAddress(params.provider),
      this.encodeAddress(params.arbiter),
      this.encodeAddress(params.token),
      xdr.ScVal.scvVec(milestonesScVals),
      this.encodeU64(params.deadline),
    ];
  }

  /**
   * Prepares arguments for fund_agreement contract invocation:
   * fund_agreement(agreement_id: u64, funder: Address)
   */
  public static buildFundAgreementArgs(agreementId: bigint | string, funder: string): xdr.ScVal[] {
    return [this.encodeU64(agreementId), this.encodeAddress(funder)];
  }

  /**
   * Prepares arguments for submit_milestone contract invocation:
   * submit_milestone(agreement_id: u64, milestone_idx: u32, proof_hash: String)
   */
  public static buildSubmitMilestoneArgs(
    agreementId: bigint | string,
    milestoneIndex: number,
    proofHash: string
  ): xdr.ScVal[] {
    return [
      this.encodeU64(agreementId),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
      this.encodeString(proofHash),
    ];
  }

  /**
   * Prepares arguments for release_milestone contract invocation:
   * release_milestone(agreement_id: u64, milestone_idx: u32)
   */
  public static buildReleaseMilestoneArgs(
    agreementId: bigint | string,
    milestoneIndex: number
  ): xdr.ScVal[] {
    return [
      this.encodeU64(agreementId),
      nativeToScVal(milestoneIndex, { type: 'u32' }),
    ];
  }

  /**
   * Prepares arguments for raise_dispute contract invocation:
   * raise_dispute(agreement_id: u64, milestone_idx: u32, caller: Address)
   */
  public static buildRaiseDisputeArgs(
    agreementId: bigint | string,
    milestoneIndex?: number,
    caller?: string
  ): xdr.ScVal[] {
    const list: xdr.ScVal[] = [this.encodeU64(agreementId)];
    if (milestoneIndex !== undefined) {
      list.push(nativeToScVal(milestoneIndex, { type: 'u32' }));
    }
    if (caller) {
      list.push(this.encodeAddress(caller));
    }
    return list;
  }

  /**
   * Prepares arguments for resolve_dispute contract invocation:
   * resolve_dispute(agreement_id: u64, client_amount: i128, provider_amount: i128)
   */
  public static buildResolveDisputeArgs(
    agreementId: bigint | string,
    clientAmount: bigint | string,
    providerAmount: bigint | string
  ): xdr.ScVal[] {
    return [
      this.encodeU64(agreementId),
      this.encodeI128(clientAmount),
      this.encodeI128(providerAmount),
    ];
  }

  /**
   * Prepares arguments for claim_timeout_refund contract invocation:
   * claim_timeout_refund(agreement_id: u64)
   */
  public static buildClaimTimeoutRefundArgs(agreementId: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId)];
  }

  /**
   * Prepares arguments for cancel_agreement contract invocation:
   * cancel_agreement(agreement_id: u64)
   */
  public static buildCancelAgreementArgs(agreementId: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId)];
  }

  /**
   * Prepares arguments for bump_agreement_ttl contract invocation:
   * bump_agreement_ttl(agreement_id: u64)
   */
  public static buildBumpAgreementTtlArgs(agreementId: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId)];
  }

  /**
   * Prepares arguments for resolve_dispute_timeout contract invocation:
   * resolve_dispute_timeout(agreement_id: u64)
   */
  public static buildResolveDisputeTimeoutArgs(agreementId: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId)];
  }

  /**
   * Prepares arguments for resolve_dispute_with_verdict contract invocation:
   * resolve_dispute_with_verdict(agreement_id: u64, client_amount: i128, provider_amount: i128, verdict_hash: String)
   */
  public static buildResolveDisputeWithVerdictArgs(
    agreementId: bigint | string,
    clientAmount: bigint | string,
    providerAmount: bigint | string,
    verdictHash: string
  ): xdr.ScVal[] {
    return [
      this.encodeU64(agreementId),
      this.encodeI128(clientAmount),
      this.encodeI128(providerAmount),
      this.encodeString(verdictHash),
    ];
  }
}

export const sorobanPipeline = new SorobanTxPipeline();
