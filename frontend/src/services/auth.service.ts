import { apiClient } from '../lib/axios';
import { ApiResponse, User } from '../types';

export interface AuthResponseData {
  user: User;
  token?: string;
}

export const authService = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    if (response.data.data.token && typeof window !== 'undefined') {
      sessionStorage.setItem('taskflow_auth_token', response.data.data.token);
    }
    return response.data.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    if (response.data.data.token && typeof window !== 'undefined') {
      sessionStorage.setItem('taskflow_auth_token', response.data.data.token);
    }
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('taskflow_auth_token');
      }
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },

  async updateProfile(data: { name?: string; role?: string; avatar?: string }): Promise<User> {
    const response = await apiClient.patch<ApiResponse<{ user: User }>>('/auth/profile', data);
    return response.data.data.user;
  },
};
