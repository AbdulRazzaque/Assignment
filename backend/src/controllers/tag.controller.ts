import { Response, NextFunction } from 'express';
import { TagService } from '../services/tag.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { CreateTagInput, UpdateTagInput } from '../validators/workspace.validator';

export class TagController {
  static async getTags(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tags = await TagService.getTags(req.user!.id);
      ApiResponse.success(res, 'Tags retrieved successfully', tags, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tag = await TagService.createTag(req.user!.id, req.body as CreateTagInput);
      ApiResponse.success(res, 'Tag created successfully', tag, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tag = await TagService.updateTag(
        req.user!.id,
        req.params.id,
        req.body as UpdateTagInput
      );
      ApiResponse.success(res, 'Tag updated successfully', tag, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await TagService.deleteTag(req.user!.id, req.params.id);
      ApiResponse.success(res, 'Tag deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }
}
