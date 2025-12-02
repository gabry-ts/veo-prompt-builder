import api from './api';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, unknown>;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface QueryAuditLogParams {
  entity?: string;
  entityId?: string;
  action?: string;
  limit?: number;
  offset?: number;
}

export const auditService = {
  async getAuditLogs(params?: QueryAuditLogParams): Promise<AuditLog[]> {
    const response = await api.get<AuditLog[]>('/audit-logs', { params });
    return response.data;
  },

  async getAuditLogsCount(params?: QueryAuditLogParams): Promise<number> {
    const response = await api.get<{ count: number }>('/audit-logs/count', { params });
    return response.data.count;
  },

  async getAuditLogsByEntity(entityId: string): Promise<AuditLog[]> {
    const response = await api.get<AuditLog[]>(`/audit-logs/entity/${entityId}`);
    return response.data;
  },
};
