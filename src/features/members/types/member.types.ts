export type MemberFilterType = 'ALL' | 'ACTIVE' | 'EXPIRED' | 'TRASH'; 

export interface Member {   
  id: string;   
  memberCode: string;   
  firstName?: string;
  lastName?: string;
  fullName: string;   
  gender: 'NAM' | 'NỮ' | 'KHÁC';   
  dateOfBirth: string;   
  phoneNumber: string;   
  email: string;   
  packageName: string;   
  packageDiscount: string;   
  assignedStaff: string;   
  assignedStaffId?: string;
  startDate?: string;
  createdAt?: string;
  lastCheckInDate?: string;
  expiryDate: string;   
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';   
  isDeleted?: boolean;
  isCheckedToday?: boolean; // Thêm trạng thái check-in trong ngày
  lastCheckInTime?: string; // Thời gian check-in gần nhất
}

export interface MemberMetrics {   
  total: number;   
  active: number;   
  expired: number;   
  expiring?: number;
  newInvoices?: number;
  checkInToday: number; 
}