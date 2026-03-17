
import { apiClient } from '@/lib/api-client';

export const profileService = {
  async getProfile() {
    return apiClient.get<any>('/profile');
  },

  async updateProfile(data: any) {
    return apiClient.put<any>('/profile', data);
  },
};
