import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export class DashboardController {
  static async getStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await DashboardService.getStats(req.user!.id);
      ApiResponse.success(res, 'Dashboard statistics retrieved successfully', stats, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getRecentTasks(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const recent = await DashboardService.getRecentTasks(req.user!.id, limit);
      ApiResponse.success(res, 'Recent tasks retrieved successfully', recent, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getUpcomingTasks(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const upcoming = await DashboardService.getUpcomingTasks(req.user!.id, limit);
      ApiResponse.success(res, 'Upcoming tasks retrieved successfully', upcoming, 200);
    } catch (error) {
      next(error);
    }
  }
}
