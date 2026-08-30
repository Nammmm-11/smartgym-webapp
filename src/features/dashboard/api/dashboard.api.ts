import { apiClient } from '../../../api/client';

// Phải có đoạn export interface này thì DashboardPage mới nhận được
export interface DashboardMetrics {
  expiringInvoicesTotal: number;
  expiredInvoicesTotal: number;
  newInvoicesTotal: number;
  membersTodayTotal: number;
}

export const dashboardApi = {
  getStatistics: async (): Promise<DashboardMetrics | null> => {
    try {
      const response = await apiClient.get('/web-app/v1/dashboard/statistics');
      return response.data.data; 
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      return null;
    }
  }
};