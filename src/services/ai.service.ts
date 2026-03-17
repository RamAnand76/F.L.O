
import { apiClient } from '@/lib/api-client';

export const aiService = {
  async enhanceText(prompt: string, field: string, currentValue: string) {
    return apiClient.post<any>('/ai/enhance', {
      prompt,
      context: {
        field,
        currentValue,
      },
    });
  },
};
