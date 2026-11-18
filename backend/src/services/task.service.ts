import mongoose from 'mongoose';
import { Task, ITaskDocument } from '../models/task.model';
import {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  UpdateTaskPriorityInput,
  TaskQueryInput,
} from '../validators/task.validator';
import { AppError } from '../utils/appError';
import { PaginationMeta } from '../types';

export interface SubtaskDto {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface TaskDto {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  tags: string[];
  projectId: string | null;
  subtasks: SubtaskDto[];
  dueDate: Date;
  userId: string;
  isOverdue: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mapTaskToDto = (task: ITaskDocument): TaskDto => {
  const now = new Date();
  const isOverdue =
    new Date(task.dueDate) < now && task.status !== 'COMPLETED';

  return {
    _id: task._id.toString(),
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    category: task.category || 'General',
    tags: Array.isArray(task.tags) ? task.tags : [],
    projectId: task.projectId ? task.projectId.toString() : null,
    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks.map((s) => ({
          _id: s._id ? s._id.toString() : undefined,
          title: s.title,
          completed: Boolean(s.completed),
        }))
      : [],
    dueDate: task.dueDate,
    userId: task.userId.toString(),
    isOverdue,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

export class TaskService {
  static async createTask(
    userId: string,
    input: CreateTaskInput
  ): Promise<TaskDto> {
    const payload: Record<string, unknown> = {
      ...input,
      userId,
    };

    if (input.projectId && mongoose.Types.ObjectId.isValid(input.projectId)) {
      payload.projectId = new mongoose.Types.ObjectId(input.projectId);
    } else {
      payload.projectId = null;
    }

    const task = await Task.create(payload);
    return mapTaskToDto(task);
  }

  static async getTasks(
    userId: string,
    query: TaskQueryInput
  ): Promise<{ tasks: TaskDto[]; pagination: PaginationMeta }> {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      tag,
      projectId,
      search,
      dueDateFrom,
      dueDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Filter criteria bound strictly to the authenticated user
    const filter: Record<string, unknown> = { userId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (category && category.trim() !== '') {
      filter.category = category.trim();
    }

    if (tag && tag.trim() !== '') {
      filter.tags = tag.trim();
    }

    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      filter.projectId = new mongoose.Types.ObjectId(projectId);
    }

    if (dueDateFrom || dueDateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dueDateFrom) dateFilter.$gte = new Date(dueDateFrom);
      if (dueDateTo) dateFilter.$lte = new Date(dueDateTo);
      filter.dueDate = dateFilter;
    }

    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { category: { $regex: sanitized, $options: 'i' } },
        { tags: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOptions).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const pagination: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      tasks: tasks.map(mapTaskToDto),
      pagination,
    };
  }

  static async getTaskById(userId: string, taskId: string): Promise<TaskDto> {
    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      throw new AppError(404, 'Task not found or unauthorized access.');
    }

    return mapTaskToDto(task);
  }

  static async updateTask(
    userId: string,
    taskId: string,
    input: UpdateTaskInput
  ): Promise<TaskDto> {
    const updatePayload: Record<string, unknown> = { ...input };

    if ('projectId' in input) {
      if (input.projectId && mongoose.Types.ObjectId.isValid(input.projectId)) {
        updatePayload.projectId = new mongoose.Types.ObjectId(input.projectId);
      } else {
        updatePayload.projectId = null;
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError(404, 'Task not found or unauthorized access.');
    }

    return mapTaskToDto(task);
  }

  static async deleteTask(userId: string, taskId: string): Promise<void> {
    const result = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!result) {
      throw new AppError(404, 'Task not found or unauthorized access.');
    }
  }

  static async updateTaskStatus(
    userId: string,
    taskId: string,
    input: UpdateTaskStatusInput
  ): Promise<TaskDto> {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: { status: input.status } },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError(404, 'Task not found or unauthorized access.');
    }

    return mapTaskToDto(task);
  }

  static async updateTaskPriority(
    userId: string,
    taskId: string,
    input: UpdateTaskPriorityInput
  ): Promise<TaskDto> {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: { priority: input.priority } },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError(404, 'Task not found or unauthorized access.');
    }

    return mapTaskToDto(task);
  }
}
