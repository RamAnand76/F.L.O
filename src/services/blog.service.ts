
import { apiClient } from '@/lib/api-client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown content
  coverImageUrl: string | null;
  tags: string[];
  status: 'draft' | 'published';
  isPublic: boolean;
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  tags: string[];
  status: 'draft' | 'published';
  readingTimeMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const blogService = {
  async getAll(): Promise<BlogPostListItem[]> {
    const res = await apiClient.get<{ posts: BlogPostListItem[] }>('/blog');
    return res.posts || [];
  },

  async getById(id: string): Promise<BlogPost> {
    return apiClient.get<BlogPost>(`/blog/${id}`);
  },

  async create(data: { title: string; content: string; excerpt: string; tags: string[]; status: 'draft' | 'published' }): Promise<BlogPost> {
    return apiClient.post<BlogPost>('/blog', data);
  },

  async update(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    return apiClient.put<BlogPost>(`/blog/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/blog/${id}`);
  },

  async publish(id: string): Promise<BlogPost> {
    return apiClient.patch<BlogPost>(`/blog/${id}/publish`);
  },

  async unpublish(id: string): Promise<BlogPost> {
    return apiClient.patch<BlogPost>(`/blog/${id}/unpublish`);
  },

  async uploadCover(id: string, file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('cover', file);
    return apiClient.post<{ url: string }>(`/blog/${id}/cover`, formData);
  },
};
