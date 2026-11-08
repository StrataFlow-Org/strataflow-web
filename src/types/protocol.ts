/**
 * StrataFlow Protocol Shared TypeScript Types & ABI Bindings.
 * Synchronized across strataflow-contracts, strataflow-backend, and strataflow-web.
 */

export type AgreementStatus =
  | 'CREATED'
  | 'FUNDED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'RESOLVED'
  | 'CANCELLED';

export type MilestoneStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'DISPUTED';

export interface ProtocolMilestone {
  index: number;
  description: string;
  amount: bigint | string;
  status: MilestoneStatus;
  proofHash?: string;
  submittedAt?: string;
  approvedAt?: string;
}

export interface ProtocolAgreement {
  id: string;
  onChainId: string;
  clientAddress: string;
  providerAddress: string;
  arbiterAddress: string;
  tokenAddress: string;
  totalAmount: bigint | string;
  balance: bigint | string;
  status: AgreementStatus;
  deadline: string | number;
  title?: string;
  description?: string;
  milestones: ProtocolMilestone[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProtocolFeeConfig {
  feeBps: number;
  recipient: string;
}

export interface ProtocolStats {
  totalAgreements: number;
  fundedAgreements: number;
  completedAgreements: number;
  totalVolumeXlm: string;
  totalVolumeUsdc: string;
  activeDisputes: number;
}

