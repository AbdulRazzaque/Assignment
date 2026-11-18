import mongoose from 'mongoose';
import { TeamMember } from '../models/teamMember.model';
import {
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
} from '../validators/workspace.validator';
import { AppError } from '../utils/appError';

export class TeamService {
  static async getMembers(userId: string) {
    const members = await TeamMember.find({ userId }).sort({ createdAt: -1 });
    return members.map((m) => ({
      _id: m._id.toString(),
      name: m.name,
      email: m.email,
      role: m.role,
      department: m.department,
      status: m.status,
      avatarColor: m.avatarColor,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }

  static async addMember(userId: string, input: CreateTeamMemberInput) {
    const exists = await TeamMember.findOne({ userId, email: input.email.toLowerCase() });
    if (exists) {
      throw new AppError(409, 'A team member with this email is already in your workspace');
    }

    const member = await TeamMember.create({
      ...input,
      userId,
    });

    return {
      _id: member._id.toString(),
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      status: member.status,
      avatarColor: member.avatarColor,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  static async updateMember(
    userId: string,
    memberId: string,
    input: UpdateTeamMemberInput
  ) {
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      throw new AppError(400, 'Invalid member ID');
    }

    const member = await TeamMember.findOneAndUpdate(
      { _id: memberId, userId },
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!member) {
      throw new AppError(404, 'Team member not found');
    }

    return {
      _id: member._id.toString(),
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      status: member.status,
      avatarColor: member.avatarColor,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }

  static async removeMember(userId: string, memberId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      throw new AppError(400, 'Invalid member ID');
    }

    const deleted = await TeamMember.findOneAndDelete({ _id: memberId, userId });
    if (!deleted) {
      throw new AppError(404, 'Team member not found');
    }
  }
}
