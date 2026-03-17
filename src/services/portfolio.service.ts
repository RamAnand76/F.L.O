
import { apiClient } from '@/lib/api-client';

export const portfolioService = {
  async getSettings() {
    return apiClient.get<any>('/portfolio');
  },

  async updateRepos(selectedRepoIds: number[]) {
    return apiClient.put<any>('/portfolio/repos', { selectedRepoIds });
  },

  async updateSkills(skills: string[]) {
    return apiClient.put<any>('/portfolio/skills', { skills });
  },

  async updateTemplate(selectedTemplate: string) {
    return apiClient.put<any>('/portfolio/template', { selectedTemplate });
  },
};
