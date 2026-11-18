import { Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { CreateProjectInput, UpdateProjectInput } from '../validators/workspace.validator';

export class ProjectController {
  static async getProjects(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projects = await ProjectService.getProjects(req.user!.id);
      ApiResponse.success(res, 'Projects retrieved successfully', projects, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(
        req.user!.id,
        req.body as CreateProjectInput
      );
      ApiResponse.success(res, 'Project created successfully', project, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.updateProject(
        req.user!.id,
        req.params.id,
        req.body as UpdateProjectInput
      );
      ApiResponse.success(res, 'Project updated successfully', project, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await ProjectService.deleteProject(req.user!.id, req.params.id);
      ApiResponse.success(res, 'Project deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }
}
