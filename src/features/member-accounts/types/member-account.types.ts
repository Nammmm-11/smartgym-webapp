export type AccountFilterType = 'ALL' | 'ACTIVE' | 'LOCKED' | 'PENDING';

export interface MemberAccount {
  id: string;
  memberCode: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'LOCKED' | 'PENDING';
  lastLogin?: string;
  role: string;
}

export interface MemberAccountMetrics {
  totalAccounts: number;
  activeAccounts: number;
  lockedAccounts: number;
  pendingAccounts: number;
}