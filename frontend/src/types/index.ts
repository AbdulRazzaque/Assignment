export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
export type TeamMemberStatus = 'ACTIVE' | 'INVITED' | 'AWAY';
export type SupportCategory = 'BUG' | 'FEATURE' | 'ACCOUNT' | 'SECURITY' | 'OTHER';
export type SupportStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface SubtaskItem {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  tags?: string[];
  projectId?: string | null;
  subtasks?: SubtaskItem[];
  dueDate: string;
  userId: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  dueDate: string | null;
  userId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface TagItem {
  _id: string;
  name: string;
  color: string;
  description: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: TeamMemberStatus;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  _id: string;
  subject: string;
  category: SupportCategory;
  priority: TaskPriority;
  message: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealth {
  status: string;
  database?: string;
  uptimeSeconds?: number;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  errors?: Array<{ field?: string; message: string }>;
}

export interface StatusDistribution {
  status: TaskStatus;
  count: number;
  percentage: number;
}

export interface PriorityDistribution {
  priority: TaskPriority;
  count: number;
  percentage: number;
}

export interface MonthlyActivityItem {
  month: string;
  monthIndex: number;
  year: number;
  approved: number;
  reviewed: number;
  todo: number;
  total: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  statusDistribution: StatusDistribution[];
  priorityDistribution: PriorityDistribution[];
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  tag?: string;
  projectId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'title' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  tags?: string[];
  projectId?: string | null;
  subtasks?: SubtaskItem[];
  dueDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  tags?: string[];
  projectId?: string | null;
  subtasks?: SubtaskItem[];
  dueDate?: string;
}
