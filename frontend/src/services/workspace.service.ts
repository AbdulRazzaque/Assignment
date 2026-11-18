import { apiClient } from '../lib/axios';
import {
  ApiResponse,
  Project,
  ProjectStatus,
  TagItem,
  TeamMember,
  TeamMemberStatus,
  SupportTicket,
  SupportCategory,
  TaskPriority,
  SystemHealth,
} from '../types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const res = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return res.data.data;
  },

  async createProject(data: {
    name: string;
    description?: string;
    color?: string;
    status?: ProjectStatus;
    dueDate?: string | null;
  }): Promise<Project> {
    const res = await apiClient.post<ApiResponse<Project>>('/projects', data);
    return res.data.data;
  },

  async updateProject(
    id: string,
    data: {
      name?: string;
      description?: string;
      color?: string;
      status?: ProjectStatus;
      dueDate?: string | null;
    }
  ): Promise<Project> {
    const res = await apiClient.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return res.data.data;
  },

  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};

export const tagService = {
  async getTags(): Promise<TagItem[]> {
    const res = await apiClient.get<ApiResponse<TagItem[]>>('/tags');
    return res.data.data;
  },

  async createTag(data: {
    name: string;
    color?: string;
    description?: string;
  }): Promise<TagItem> {
    const res = await apiClient.post<ApiResponse<TagItem>>('/tags', data);
    return res.data.data;
  },

  async updateTag(
    id: string,
    data: {
      name?: string;
      color?: string;
      description?: string;
    }
  ): Promise<TagItem> {
    const res = await apiClient.patch<ApiResponse<TagItem>>(`/tags/${id}`, data);
    return res.data.data;
  },

  async deleteTag(id: string): Promise<void> {
    await apiClient.delete(`/tags/${id}`);
  },
};

export const teamService = {
  async getMembers(): Promise<TeamMember[]> {
    const res = await apiClient.get<ApiResponse<TeamMember[]>>('/team');
    return res.data.data;
  },

  async addMember(data: {
    name: string;
    email: string;
    role: string;
    department: string;
    status?: TeamMemberStatus;
    avatarColor?: string;
  }): Promise<TeamMember> {
    const res = await apiClient.post<ApiResponse<TeamMember>>('/team', data);
    return res.data.data;
  },

  async updateMember(
    id: string,
    data: {
      name?: string;
      role?: string;
      department?: string;
      status?: TeamMemberStatus;
      avatarColor?: string;
    }
  ): Promise<TeamMember> {
    const res = await apiClient.patch<ApiResponse<TeamMember>>(`/team/${id}`, data);
    return res.data.data;
  },

  async removeMember(id: string): Promise<void> {
    await apiClient.delete(`/team/${id}`);
  },
};

export const supportService = {
  async getTickets(): Promise<SupportTicket[]> {
    const res = await apiClient.get<ApiResponse<SupportTicket[]>>('/support/tickets');
    return res.data.data;
  },

  async createTicket(data: {
    subject: string;
    category: SupportCategory;
    priority: TaskPriority;
    message: string;
  }): Promise<SupportTicket> {
    const res = await apiClient.post<ApiResponse<SupportTicket>>('/support/tickets', data);
    return res.data.data;
  },

  async deleteTicket(id: string): Promise<void> {
    await apiClient.delete(`/support/tickets/${id}`);
  },

  async checkHealth(): Promise<{ health: SystemHealth; latencyMs: number }> {
    const start = performance.now();
    const res = await apiClient.get<ApiResponse<SystemHealth>>('/health');
    const latencyMs = Math.round(performance.now() - start);
    return { health: res.data.data, latencyMs };
  },
};
