import type {
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  PromptVersion,
} from '../types/prompt';
import api from './api';

export interface PaginatedPromptsResponse {
  data: Prompt[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const promptService = {
  getAll: async (): Promise<Prompt[]> => {
    const response = await api.get<Prompt[]>('/prompts');
    return response.data;
  },

  getPaginated: async (cursor?: string, limit = 20): Promise<PaginatedPromptsResponse> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (cursor) {
      params.append('cursor', cursor);
    }
    const response = await api.get<PaginatedPromptsResponse>(`/prompts?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Prompt> => {
    const response = await api.get<Prompt>(`/prompts/${id}`);
    return response.data;
  },

  create: async (data: CreatePromptRequest): Promise<Prompt> => {
    const response = await api.post<Prompt>('/prompts', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePromptRequest): Promise<Prompt> => {
    const response = await api.patch<Prompt>(`/prompts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/prompts/${id}`);
  },

  deleteBulk: async (ids: string[]): Promise<{ deleted: number }> => {
    const response = await api.delete<{ deleted: number }>('/prompts/bulk', { data: { ids } });
    return response.data;
  },

  getVersions: async (id: string): Promise<PromptVersion[]> => {
    const response = await api.get<PromptVersion[]>(`/prompts/${id}/versions`);
    return response.data;
  },

  restoreVersion: async (id: string, versionId: string): Promise<Prompt> => {
    const response = await api.post<Prompt>(`/prompts/${id}/versions/${versionId}/restore`);
    return response.data;
  },

  exportMarkdown: async (id: string): Promise<string> => {
    const response = await api.get<{ markdown: string }>(`/prompts/${id}/export/markdown`);
    return response.data.markdown;
  },

  getByShareToken: async (token: string): Promise<Prompt> => {
    const response = await api.get<Prompt>(`/prompts/shared/${token}`);
    return response.data;
  },
};
