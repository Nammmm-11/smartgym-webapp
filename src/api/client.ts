import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    let tenantId = localStorage.getItem('tenantId');
    if (!tenantId) {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          tenantId = u?.tenantId || u?.tenants?.[0]?.tenant?.id || u?.tenants?.[0]?.tenantId || null;
          if (tenantId) {
            localStorage.setItem('tenantId', tenantId);
          }
        }
      } catch {
        // ignore
      }
    }

    if (tenantId && typeof tenantId === 'string' && tenantId.trim() !== '') {
      config.headers['X-Tenant-Id'] = tenantId.trim();
      config.headers['tenantid'] = tenantId.trim();
      config.headers['X-TenantId'] = tenantId.trim();
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);