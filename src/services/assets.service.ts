import { apiClient } from '@/lib/api-client';

export interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export const assetsService = {
  async getAll(type?: string, sortBy?: string) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (sortBy) params.append('sortBy', sortBy);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Asset[]>(`/assets${queryString}`);
  },
  
  async upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    // We cast to any because our apiClient wrappers default to JSON if not specified, 
    // but the internal apiClient logic inherently handles FormData correctly 
    // without overriding the Content-Type header.
    return apiClient.post<Asset>('/assets/upload', formData);
  },
  
  async delete(id: string) {
    return apiClient.delete<void>(`/assets/${id}`);
  }
};
