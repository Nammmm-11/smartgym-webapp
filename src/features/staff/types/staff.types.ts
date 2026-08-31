export type StaffRole = 'RECEPTIONIST' | 'TRAINER';
export type StaffStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
export type StaffFilterType = 'ALL' | 'ACTIVE' | 'ON_LEAVE' | 'TRASH'; // Thêm TRASH

export interface StaffMember {
  id: string;
  staffCode: string;
  lastName: string;
  firstName: string;
  fullName: string;
  role: StaffRole;
  phoneNumber: string;
  email: string;
  status: StaffStatus;
  salary: number;
  completedShifts: number;
  isCheckedInToday: boolean;
  activeMembersCount?: number;
  ptRevenue?: number;
  commission?: number;
  isDeleted?: boolean; // Quản lý xóa mềm
  userId?: string;
}

export interface StaffMetrics {
  totalSalary: string;
  attendanceCount: string;
  totalStaff: number;
  completedShifts: number;
  totalTrainers?: number;
  activeMembers?: number;
  ptRevenue?: string;
  commission?: string;
}