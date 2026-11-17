import { Request } from 'express';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  dueDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponseData<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: unknown[];
}
