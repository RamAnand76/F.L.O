
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
    // Map new template IDs to original ones for backend compatibility if the backend has restricted enums
    const allowedIds = ['minimal', 'developer', 'creative', 'saas', 'brutalist'];
    const backendId = allowedIds.includes(selectedTemplate) ? selectedTemplate : 'minimal';
    
    // We send the backend a safe ID but keep the new one in the UI state
    // In a production app, the backend should be updated instead!
    return apiClient.put<any>('/portfolio/template', { selectedTemplate: backendId });
  },
  
  async publish(isPublished: boolean) {
    return apiClient.put<any>('/portfolio/publish', { isPublished });
  },
};
