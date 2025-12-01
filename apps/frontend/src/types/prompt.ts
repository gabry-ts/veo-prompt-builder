export interface Prompt {
  id: string;
  name: string;
  description?: string;
  jsonData: Record<string, unknown>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptRequest {
  name: string;
  description?: string;
  jsonData: Record<string, unknown>;
}

export interface UpdatePromptRequest {
  name?: string;
  description?: string;
  jsonData?: Record<string, unknown>;
}
