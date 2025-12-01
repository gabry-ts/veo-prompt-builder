import api from './api';
import type { Prompt, CreatePromptRequest, UpdatePromptRequest } from '../types/prompt';

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
};
