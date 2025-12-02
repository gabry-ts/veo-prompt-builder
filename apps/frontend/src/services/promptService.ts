import type {
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  PromptVersion,
} from '../types/prompt';
import api from './api';

export const promptService = {
  getAll: async (): Promise<Prompt[]> => {
    const response = await api.get<Prompt[]>('/prompts');
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
