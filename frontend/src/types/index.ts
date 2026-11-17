export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  dueDate: string;
  userId: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
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
  dueDate: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  dueDate?: string;
}
