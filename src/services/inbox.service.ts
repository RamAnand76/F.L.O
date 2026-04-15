
import { apiClient } from '@/lib/api-client';

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
  portfolioUsername: string;
}

export interface InboxStats {
  total: number;
  unread: number;
  starred: number;
}

export const inboxService = {
  async getAll(): Promise<InboxMessage[]> {
    const res = await apiClient.get<{ messages: InboxMessage[] }>('/inbox');
    return res.messages || [];
  },

  async getStats(): Promise<InboxStats> {
    return apiClient.get<InboxStats>('/inbox/stats');
  },

  async markRead(id: string): Promise<InboxMessage> {
    return apiClient.patch<InboxMessage>(`/inbox/${id}/read`);
  },

  async markUnread(id: string): Promise<InboxMessage> {
    return apiClient.patch<InboxMessage>(`/inbox/${id}/unread`);
  },

  async toggleStar(id: string): Promise<InboxMessage> {
    return apiClient.patch<InboxMessage>(`/inbox/${id}/star`);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/inbox/${id}`);
  },

  async deleteAll(): Promise<void> {
    return apiClient.delete('/inbox');
  },
};
