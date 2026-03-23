import { apiClient } from '@/lib/api-client';

export interface Education {
  id: string;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  isCurrent?: boolean;
}

export const profileService = {
  async getProfile() {
    return apiClient.get<any>('/profile');
  },

  async updateProfile(data: any) {
    return apiClient.put<any>('/profile', data);
  },

  async syncGithub() {
    return apiClient.post<any>('/profile/sync-github', {});
  },

  async importResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<any>('/profile/import-resume', formData);
  },

  // Education CRUD
  async addEducation(data: Omit<Education, 'id'>) {
    return apiClient.post<Education>('/profile/education', data);
  },

  async updateEducation(id: string, data: Partial<Education>) {
    return apiClient.patch<Education>(`/profile/education/${id}`, data);
  },

  async deleteEducation(id: string) {
    return apiClient.delete(`/profile/education/${id}`);
  },

  // Experience CRUD
  async addExperience(data: Omit<Experience, 'id'>) {
    return apiClient.post<Experience>('/profile/experience', data);
  },

  async updateExperience(id: string, data: Partial<Experience>) {
    return apiClient.patch<Experience>(`/profile/experience/${id}`, data);
  },

  async deleteExperience(id: string) {
    return apiClient.delete(`/profile/experience/${id}`);
  },
};
