import { apiClient } from '../../../api/client';
import type { MemberAccount } from '../types/member-account.types';

// Cập nhật lại tên các thuộc tính cho khớp với MemberAccountMetricCardsProps
export interface AccountMetrics {
  totalAccounts: number;
  activeAccounts: number;
  lockedAccounts: number;
  pendingAccounts: number;
}

export const memberAccountApi = {
  getAccounts: async (): Promise<MemberAccount[]> => {
    try {
      const response = await apiClient.get('/web-app/v1/multi-tenants/members/get-list');
      const rawData = response.data?.data || response.data?.items || (Array.isArray(response.data) ? response.data : []);
      
      return rawData.map((item: any) => ({
        id: item.id || item.memberCode,
        fullName: item.fullName,
        email: item.email || `${item.phoneNumber}@fitgym.com`,
        phoneNumber: item.phoneNumber,
        memberCode: item.memberCode,
        username: item.phoneNumber,
        status: item.status === 'ACTIVE' ? 'ACTIVE' : 'LOCKED',
        createdAt: item.createdAt || '2026-01-01'
      }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản hội viên:", error);
      return [];
    }
  },

  updateAccountStatus: async (id: string, status: string): Promise<any> => {
    const response = await apiClient.put(`/web-app/v1/multi-tenants/members/update/${id}`, { status });
    return response.data;
  },

  resetPassword: async (id: string): Promise<any> => {
    const response = await apiClient.post(`/web-app/v1/multi-tenants/members/reset-password`, { id });
    return response.data;
  },

  calculateMetrics: (accounts: MemberAccount[]): AccountMetrics => {
    const active = accounts.filter(a => a.status === 'ACTIVE').length;
    const locked = accounts.filter(a => a.status === 'LOCKED').length;
    return {
      totalAccounts: accounts.length,
      activeAccounts: active,
      lockedAccounts: locked,
      pendingAccounts: 0
    };
  }
};