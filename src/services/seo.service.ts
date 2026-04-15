
import { apiClient } from '@/lib/api-client';

export interface SeoSettings {
  id?: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string | null;
  keywords: string[];
  canonicalUrl: string | null;
  twitterCard: 'summary' | 'summary_large_image';
  twitterSite: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  updatedAt?: string;
}

export interface SeoScore {
  overall: number;
  titleScore: number;
  descriptionScore: number;
  keywordsScore: number;
  atsScore: number;
  suggestions: string[];
  strengths: string[];
}

export const seoService = {
  async getSettings(): Promise<SeoSettings> {
    return apiClient.get<SeoSettings>('/seo');
  },

  async updateSettings(data: Partial<SeoSettings>): Promise<SeoSettings> {
    return apiClient.put<SeoSettings>('/seo', data);
  },

  async uploadOgImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post<{ url: string }>('/seo/og-image', formData);
  },

  async analyzeSeo(): Promise<SeoScore> {
    return apiClient.post<SeoScore>('/seo/analyze');
  },
};
