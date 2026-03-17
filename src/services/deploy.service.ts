
import { apiClient } from '@/lib/api-client';

export const deployService = {
  async deployToGitHubPages(repoName: string, customDomain?: string) {
    return apiClient.post<any>('/deploy/github-pages', { repoName, customDomain });
  },

  async getStatus() {
    return apiClient.get<any>('/deploy/status');
  },
};
