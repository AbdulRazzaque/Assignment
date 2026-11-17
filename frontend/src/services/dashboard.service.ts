import { apiClient } from '../lib/axios';
import { ApiResponse, DashboardStats, MonthlyActivityItem, Task } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },

  async getActivity(): Promise<MonthlyActivityItem[]> {
    const response = await apiClient.get<ApiResponse<MonthlyActivityItem[]>>('/dashboard/activity');
    return response.data.data;
  },

  async getRecentTasks(limit = 5): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/dashboard/recent-tasks?limit=${limit}`
    );
    return response.data.data;
  },

  async getUpcomingTasks(limit = 5): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/dashboard/upcoming-tasks?limit=${limit}`
    );
    return response.data.data;
  },
};
