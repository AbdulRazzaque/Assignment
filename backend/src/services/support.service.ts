import mongoose from 'mongoose';
import { SupportTicket } from '../models/supportTicket.model';
import { CreateSupportTicketInput } from '../validators/workspace.validator';
import { AppError } from '../utils/appError';

export class SupportService {
  static async getTickets(userId: string) {
    const tickets = await SupportTicket.find({ userId }).sort({ createdAt: -1 });
    return tickets.map((t) => ({
      _id: t._id.toString(),
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      message: t.message,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  static async createTicket(userId: string, input: CreateSupportTicketInput) {
    const ticket = await SupportTicket.create({
      ...input,
      userId,
    });

    return {
      _id: ticket._id.toString(),
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      message: ticket.message,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }

  static async deleteTicket(userId: string, ticketId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new AppError(400, 'Invalid ticket ID');
    }

    const deleted = await SupportTicket.findOneAndDelete({ _id: ticketId, userId });
    if (!deleted) {
      throw new AppError(404, 'Support ticket not found');
    }
  }
}
