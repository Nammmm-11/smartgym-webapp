import React, { createContext, useContext, useState } from 'react';
import { authApi } from '../api/auth.api';

interface AuthContextType {
  user: any;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Khởi tạo state user từ localStorage để khi F5 trang không bị mất trạng thái đăng nhập
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      // Backend trả về Result<LoginResponseDto>: { isSuccess: true, data: { accessToken, refreshToken, user, tenants } }
      const payload = response?.data || response;
      const currentUser = payload?.user || payload;
      const accessToken = payload?.accessToken || response?.accessToken;
      const refreshToken = payload?.refreshToken || response?.refreshToken;

      // 1. Lưu thông tin user vào State để App.tsx tự động chuyển trang
      setUser(currentUser);

      // 2. Lưu vào localStorage để duy trì phiên đăng nhập
      localStorage.setItem('user', JSON.stringify(currentUser));
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      if (payload?.tenants && Array.isArray(payload.tenants) && payload.tenants.length > 0) {
        const currentTenant = payload.tenants.find((t: any) => t.isCurrentTenant) || payload.tenants[0];
        const realTenantId = currentTenant?.tenant?.id || currentTenant?.tenantId || currentTenant?.id;
        if (realTenantId) {
          localStorage.setItem('tenantId', String(realTenantId));
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Gọi API báo cho Backend biết user này đã đăng xuất
      await authApi.logout();
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      // Dù API thành công hay lỗi thì vẫn phải xóa token dưới LocalStorage để văng ra màn đăng nhập
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tenantId');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);