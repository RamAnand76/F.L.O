import { apiClient } from '@/lib/api-client';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
  isFeatured?: boolean;
  caseStudyUrl?: string;
}

export const testimonialsService = {
  async getAll() {
    return apiClient.get<Testimonial[]>('/testimonials');
  },
  
  async create(data: Omit<Testimonial, 'id'>) {
    return apiClient.post<Testimonial>('/testimonials', data);
  },
  
  async update(id: string, data: Partial<Testimonial>) {
    return apiClient.patch<Testimonial>(`/testimonials/${id}`, data);
  },
  
  async delete(id: string) {
    return apiClient.delete<void>(`/testimonials/${id}`);
  }
};
