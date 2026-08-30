import { apiClient } from '../../../api/client';
import type { StaffMember, StaffMetrics, StaffRole, StaffStatus } from '../types/staff.types';

// Helper chuyển đổi Role giữa Backend (number/string) và Frontend ('RECEPTIONIST' | 'TRAINER')
const mapRoleFromBackend = (role: any): StaffRole => {
  if (role === 1 || role === 'Receptionist' || role === 'RECEPTIONIST') return 'RECEPTIONIST';
  return 'TRAINER';
};

const mapRoleToBackend = (role: StaffRole): number => {
  return role === 'RECEPTIONIST' ? 1 : 2;
};

// Helper chuyển đổi Status giữa Backend và Frontend
const mapStatusFromBackend = (status: any): StaffStatus => {
  if (status === 1 || status === 'Active' || status === 'ACTIVE') return 'ACTIVE';
  if (status === 2 || status === 'OnLeave' || status === 'ON_LEAVE') return 'ON_LEAVE';
  return 'INACTIVE';
};

const mapStatusToBackend = (status: StaffStatus): number => {
  if (status === 'ACTIVE') return 1;
  if (status === 'ON_LEAVE') return 2;
  return 3;
};

// Cache danh sách nhân viên gần nhất để merge khi update từng phần (như toggle check-in)
let cachedStaffList: StaffMember[] = [];

// Map đối tượng DTO từ SQL Server sang StaffMember của Frontend
const mapStaffFromBackend = (item: any): StaffMember => {
  return {
    id: item.id || item.Id,
    staffCode: item.staffCode || item.StaffCode || '',
    lastName: item.lastName || item.LastName || '',
    firstName: item.firstName || item.FirstName || '',
    fullName: item.fullName || item.FullName || `${item.lastName || item.LastName || ''} ${item.firstName || item.FirstName || ''}`.trim(),
    role: mapRoleFromBackend(item.role ?? item.Role),
    phoneNumber: item.phoneNumber || item.PhoneNumber || '',
    email: item.email || item.Email || '',
    status: mapStatusFromBackend(item.status ?? item.Status),
    salary: item.salary ?? item.Salary ?? 0,
    completedShifts: item.completedShifts ?? item.CompletedShifts ?? 0,
    isCheckedInToday: item.isCheckedInToday ?? item.IsCheckedInToday ?? false,
    activeMembersCount: item.activeMembersCount ?? item.ActiveMembersCount ?? 0,
    ptRevenue: item.ptRevenue ?? item.PtRevenue ?? 0,
    commission: item.commission ?? item.Commission ?? 0,
    isDeleted: item.isDeleted ?? item.IsDeleted ?? false
  };
};

export const staffApi = {
  // 1. Lấy danh sách nhân sự THẬT từ SQL Server qua Backend API C#
  getStaffs: async (): Promise<StaffMember[]> => {
    try {
      const response = await apiClient.get('/web-app/v1/multi-tenants/staffs/get-list');
      const result = response.data;
      
      if (result && result.isSuccess && Array.isArray(result.data)) {
        cachedStaffList = result.data.map(mapStaffFromBackend);
        return cachedStaffList;
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân sự từ CSDL SQL Server:', error);
      return [];
    }
  },

  // 2. Tạo mới nhân sự trực tiếp vào bảng Staffs trong SQL Server
  createStaff: async (data: Omit<StaffMember, 'id' | 'staffCode' | 'isDeleted'>): Promise<StaffMember> => {
    const payload = {
      staffCode: null, // Backend sẽ tự sinh mã REC001/PT001 nếu null
      firstName: data.firstName,
      lastName: data.lastName,
      role: mapRoleToBackend(data.role),
      phoneNumber: data.phoneNumber,
      email: data.email,
      status: mapStatusToBackend(data.status),
      salary: data.salary,
      completedShifts: data.completedShifts || 0,
      isCheckedInToday: data.isCheckedInToday || false,
      activeMembersCount: data.activeMembersCount || 0,
      ptRevenue: data.ptRevenue || 0,
      commission: data.commission || 0,
      userId: null
    };

    const response = await apiClient.post('/web-app/v1/multi-tenants/staffs/create', payload);
    const result = response.data;

    if (result && result.isSuccess && result.data) {
      return mapStaffFromBackend(result.data);
    }
    throw new Error(result?.message || 'Không thể tạo nhân sự mới vào CSDL');
  },

  // 3. Cập nhật nhân sự trong SQL Server (Đảm bảo truyền ĐẦY ĐỦ thuộc tính bắt buộc)
  updateStaff: async (id: string, updated: Partial<StaffMember>): Promise<StaffMember | null> => {
    // Tìm nhân viên hiện tại từ cache để đảm bảo không bị thiếu FirstName, LastName, PhoneNumber
    const existing = cachedStaffList.find(s => s.id === id);

    const merged = {
      ...existing,
      ...updated
    };

    const payload = {
      id: id,
      firstName: merged.firstName || 'Staff',
      lastName: merged.lastName || 'Member',
      role: mapRoleToBackend(merged.role || 'RECEPTIONIST'),
      phoneNumber: merged.phoneNumber || '0900000000',
      email: merged.email || null,
      status: mapStatusToBackend(merged.status || 'ACTIVE'),
      salary: merged.salary ?? 0,
      completedShifts: merged.completedShifts ?? 0,
      isCheckedInToday: merged.isCheckedInToday ?? false,
      activeMembersCount: merged.activeMembersCount ?? 0,
      ptRevenue: merged.ptRevenue ?? 0,
      commission: merged.commission ?? 0,
      userId: null
    };

    const response = await apiClient.put(`/web-app/v1/multi-tenants/staffs/update/${id}`, payload);
    const result = response.data;

    if (result && result.isSuccess && result.data) {
      return mapStaffFromBackend(result.data);
    }
    return null;
  },

  // 4. Xóa mềm nhân sự trong SQL Server (chuyển IsDeleted = true)
  deleteStaff: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete('/web-app/v1/multi-tenants/staffs/delete', {
      data: { ids: [id] }
    });
    return response.data?.isSuccess || false;
  },

  // 5. Khôi phục nhân sự từ thùng rác trong SQL Server (IsDeleted = false)
  restoreStaff: async (id: string): Promise<boolean> => {
    const response = await apiClient.post('/web-app/v1/multi-tenants/staffs/restore', {
      ids: [id]
    });
    return response.data?.isSuccess || false;
  },

  // 6. Tính toán chỉ số thống kê (Metrics)
  calculateMetrics: (staffs: StaffMember[], role: 'RECEPTIONIST' | 'TRAINER'): StaffMetrics => {
    const filtered = staffs.filter(s => s.role === role && !s.isDeleted);
    const totalStaff = filtered.length;
    const attendanceCountChecked = filtered.filter(s => s.isCheckedInToday).length;
    
    if (role === 'RECEPTIONIST') {
      const totalSalaryNum = filtered.reduce((acc, s) => acc + (s.salary || 0), 0);
      const totalShifts = filtered.reduce((acc, s) => acc + (s.completedShifts || 0), 0);
      return {
        totalSalary: totalSalaryNum.toLocaleString('vi-VN') + 'đ',
        attendanceCount: `${attendanceCountChecked} / ${totalStaff || 1}`,
        totalStaff,
        completedShifts: totalShifts
      };
    } else {
      const totalRevenueNum = filtered.reduce((acc, s) => acc + (s.ptRevenue || 0), 0);
      const totalCommissionNum = filtered.reduce((acc, s) => acc + (s.commission || 0), 0);
      const totalActiveMembers = filtered.reduce((acc, s) => acc + (s.activeMembersCount || 0), 0);
      
      return {
        totalSalary: totalRevenueNum.toLocaleString('vi-VN') + 'đ',
        attendanceCount: `${attendanceCountChecked} / ${totalStaff || 1}`,
        totalStaff,
        completedShifts: filtered.reduce((acc, s) => acc + (s.completedShifts || 0), 0),
        totalTrainers: totalStaff,
        activeMembers: totalActiveMembers,
        ptRevenue: totalRevenueNum.toLocaleString('vi-VN') + 'đ',
        commission: totalCommissionNum.toLocaleString('vi-VN') + 'đ'
      };
    }
  }
};