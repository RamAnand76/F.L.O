
import { apiClient } from '@/lib/api-client';

export const githubService = {
  async connectAccount(username: string) {
    return apiClient.post<any>('/github/connect', { username });
  },

  async getProfile(page: number = 1, limit: number = 10) {
    return apiClient.get<any>(`/github/profile?page=${page}&limit=${limit}`);
  },

  async getRepos(page: number = 1, limit: number = 10) {
    return apiClient.get<any>(`/github/repos?page=${page}&limit=${limit}`);
  },

  async refreshData() {
    return apiClient.post<any>('/github/refresh');
  },

  async disconnect() {
    return apiClient.delete<any>('/github/disconnect');
  },
};
