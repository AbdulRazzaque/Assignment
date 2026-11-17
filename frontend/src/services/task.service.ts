import { apiClient } from '../lib/axios';
import {
  ApiResponse,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskQueryParams,
  TaskStatus,
  TaskPriority,
} from '../types';

export const taskService = {
  async getTasks(params?: TaskQueryParams): Promise<{
    tasks: Task[];
    pagination: ApiResponse['pagination'];
  }> {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks', {
      params,
    });
    return {
      tasks: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data;
  },

  async updateTask(id: string, data: UpdateTaskInput): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  async updatePriority(id: string, priority: TaskPriority): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${id}/priority`,
      { priority }
    );
    return response.data.data;
  },
};
