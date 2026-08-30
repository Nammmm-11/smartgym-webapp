import { apiClient } from './client';

export const authApi = {
  login: async (credentials: { email: string; password: string; tenantId?: string }) => {
    const response = await apiClient.post('/web-app/v1/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken') || 'dummy-token';
      const response = await apiClient.post('/web-app/v1/auth/logout', { refreshToken });
      return response.data;
    } catch (error) {
      console.warn("Server logout notification warning (proceeding with local cleanup):", error);
      return { isSuccess: true };
    }
  }
};