
import { apiClient } from '@/lib/api-client';

export const authService = {
  async register(data: any) {
    const response = await apiClient.post<any>('/auth/register', data);
    if (response.tokens?.accessToken) {
      apiClient.setToken(response.tokens.accessToken);
      if (response.tokens.refreshToken) {
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
      }
    }
    return response;
  },

  async login(data: any) {
    const response = await apiClient.post<any>('/auth/login', data);
    if (response.tokens?.accessToken) {
      apiClient.setToken(response.tokens.accessToken);
      if (response.tokens.refreshToken) {
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
      }
    }
    return response;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearToken();
    }
  },

  async getCurrentUser() {
    return apiClient.get<any>('/auth/me');
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<any>('/auth/refresh', { refreshToken });
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
    }
    return response;
  },
};
