
import { apiClient } from '@/lib/api-client';

export const githubService = {
  async connectAccount(username: string) {
    return apiClient.post<any>('/github/connect', { username });
  },

  async getProfile() {
    return apiClient.get<any>('/github/profile');
  },

  async getRepos() {
    return apiClient.get<any>('/github/repos');
  },

  async refreshData() {
    return apiClient.post<any>('/github/refresh');
  },

  async disconnect() {
    return apiClient.delete<any>('/github/disconnect');
  },
};
