export interface Prompt {
  id: string;
  name: string;
  description?: string;
  jsonData: Record<string, unknown>;
  userId: string;
  tags: string[];
  isFavorite: boolean;
  rating?: number;
  shareToken?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptRequest {
  name: string;
  description?: string;
  jsonData: Record<string, unknown>;
  tags?: string[];
  isFavorite?: boolean;
  rating?: number;
  isPublic?: boolean;
}

export interface UpdatePromptRequest {
  name?: string;
  description?: string;
  jsonData?: Record<string, unknown>;
  tags?: string[];
  isFavorite?: boolean;
  rating?: number;
  isPublic?: boolean;
}
