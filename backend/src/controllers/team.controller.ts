import { Response, NextFunction } from 'express';
import { TeamService } from '../services/team.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { CreateTeamMemberInput, UpdateTeamMemberInput } from '../validators/workspace.validator';

export class TeamController {
  static async getMembers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const members = await TeamService.getMembers(req.user!.id);
      ApiResponse.success(res, 'Team members retrieved successfully', members, 200);
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const member = await TeamService.addMember(
        req.user!.id,
        req.body as CreateTeamMemberInput
      );
      ApiResponse.success(res, 'Team member invited successfully', member, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const member = await TeamService.updateMember(
        req.user!.id,
        req.params.id,
        req.body as UpdateTeamMemberInput
      );
      ApiResponse.success(res, 'Team member updated successfully', member, 200);
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await TeamService.removeMember(req.user!.id, req.params.id);
      ApiResponse.success(res, 'Team member removed successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }
}
