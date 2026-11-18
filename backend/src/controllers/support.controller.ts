import { Response, NextFunction } from 'express';
import { SupportService } from '../services/support.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';
import { CreateSupportTicketInput } from '../validators/workspace.validator';

export class SupportController {
  static async getTickets(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tickets = await SupportService.getTickets(req.user!.id);
      ApiResponse.success(res, 'Support tickets retrieved successfully', tickets, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createTicket(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const ticket = await SupportService.createTicket(
        req.user!.id,
        req.body as CreateSupportTicketInput
      );
      ApiResponse.success(res, 'Support ticket submitted successfully', ticket, 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTicket(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await SupportService.deleteTicket(req.user!.id, req.params.id);
      ApiResponse.success(res, 'Support ticket closed successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }
}
