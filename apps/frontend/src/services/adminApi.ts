import api from './api';
import type { UserRole } from '../store/authStore';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
}

export interface ChangePasswordDto {
  newPassword: string;
}

export const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  changeUserPassword: async (id: string, data: ChangePasswordDto): Promise<void> => {
    await api.patch(`/users/${id}/password`, data);
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
