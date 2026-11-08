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
  1: 'Protocol is currently paused by admin circuit breaker',
  2: 'Agreement is already funded',
  3: 'Deposit amount is insufficient to cover milestones',
  4: 'Milestone index is out of bounds',
  5: 'Milestone is not in SUBMITTED state',
  6: 'Sequential milestone delivery violation: prior milestone not approved',
  7: 'Deadline has expired',
  8: 'Agreement is already completed',
  9: 'Caller is unauthorized for this action',
  10: 'Dispute amounts do not match total agreement balance',
  11: 'Agreement deadline has not passed yet for refund claim',
  12: 'Agreement cannot be cancelled because it is already funded',
  13: 'Protocol fee exceeds maximum allowed percentage (10%)',
  14: 'Invalid contract state transition',
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

    // Fetch account sequence from RPC
    const accountResponse = await this.server.getAccount(senderAddress);
    const sourceAccount = new Account(senderAddress, accountResponse.sequence);

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

  /**
   * Prepares arguments for create_agreement contract invocation
   */
  public static buildCreateAgreementArgs(params: {
    provider: string;
    arbiter: string;
    token: string;
    totalAmount: bigint | string;
    deadline: number;
    milestoneDescriptions: string[];
    milestoneAmounts: Array<bigint | string>;
  }): xdr.ScVal[] {
    const milestonesScVals = params.milestoneDescriptions.map((desc, idx) => {
      const amount = params.milestoneAmounts[idx] || 0n;
      return nativeToScVal({
        description: desc,
        amount: BigInt(amount),
      });
    });

    return [
      this.encodeAddress(params.provider),
      this.encodeAddress(params.arbiter),
      this.encodeAddress(params.token),
      this.encodeI128(params.totalAmount),
      this.encodeU64(params.deadline),
      nativeToScVal(milestonesScVals),
    ];
  }

  /**
   * Prepares arguments for fund_agreement contract invocation
   */
  public static buildFundAgreementArgs(agreementId: bigint | string, amount: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId), this.encodeI128(amount)];
  }

  /**
   * Prepares arguments for submit_milestone contract invocation
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
   * Prepares arguments for release_milestone contract invocation
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
   * Prepares arguments for raise_dispute contract invocation
   */
  public static buildRaiseDisputeArgs(agreementId: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId)];
  }

  /**
   * Prepares arguments for resolve_dispute contract invocation
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
   * Prepares arguments for claim_timeout_refund contract invocation
   */
  public static buildClaimTimeoutRefundArgs(agreementId: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId)];
  }

  /**
   * Prepares arguments for cancel_agreement contract invocation
   */
  public static buildCancelAgreementArgs(agreementId: bigint | string): xdr.ScVal[] {
    return [this.encodeU64(agreementId)];
  }
}

export const sorobanPipeline = new SorobanTxPipeline();
