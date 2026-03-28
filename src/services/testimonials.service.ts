import { apiClient } from '@/lib/api-client';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  isFeatured?: boolean;
  isApproved?: boolean;
  caseStudyUrl?: string;
}

export const testimonialsService = {
  async getAll() {
    return apiClient.get<Testimonial[]>('/testimonials');
  },

  async getPublic(username: string) {
    return apiClient.get<Testimonial[]>(`/testimonials/public/${username}`);
  },
  
  async create(data: Omit<Testimonial, 'id'>) {
    return apiClient.post<Testimonial>('/testimonials', data);
  },

  async submitPublic(username: string, data: Omit<Testimonial, 'id' | 'isApproved' | 'isFeatured'>) {
    return apiClient.post<Testimonial>(`/testimonials/public/${username}`, data);
  },
  
  async update(id: string, data: Partial<Testimonial>) {
    return apiClient.patch<Testimonial>(`/testimonials/${id}`, data);
  },

  async approve(id: string) {
    return apiClient.patch<Testimonial>(`/testimonials/${id}/approve`, {});
  },
  
  async delete(id: string) {
    return apiClient.delete<void>(`/testimonials/${id}`);
  }
};
