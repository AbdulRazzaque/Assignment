import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';
import {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  UpdateTaskPriorityInput,
  TaskQueryInput,
} from '../validators/task.validator';

export class TaskController {
  static async createTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await TaskService.createTask(
        req.user!.id,
        req.body as CreateTaskInput
      );
      ApiResponse.success(res, 'Task created successfully', task, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = (req.query as unknown) as TaskQueryInput;
      const { tasks, pagination } = await TaskService.getTasks(
        req.user!.id,
        query
      );
      ApiResponse.success(
        res,
        'Tasks retrieved successfully',
        tasks,
        200,
        pagination
      );
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await TaskService.getTaskById(req.user!.id, req.params.id);
      ApiResponse.success(res, 'Task details retrieved successfully', task, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await TaskService.updateTask(
        req.user!.id,
        req.params.id,
        req.body as UpdateTaskInput
      );
      ApiResponse.success(res, 'Task updated successfully', task, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await TaskService.deleteTask(req.user!.id, req.params.id);
      ApiResponse.success(res, 'Task deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateTaskStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await TaskService.updateTaskStatus(
        req.user!.id,
        req.params.id,
        req.body as UpdateTaskStatusInput
      );
      ApiResponse.success(res, 'Task status updated successfully', task, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateTaskPriority(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const task = await TaskService.updateTaskPriority(
        req.user!.id,
        req.params.id,
        req.body as UpdateTaskPriorityInput
      );
      ApiResponse.success(res, 'Task priority updated successfully', task, 200);
    } catch (error) {
      next(error);
    }
  }
}
