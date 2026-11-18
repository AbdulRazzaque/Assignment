import mongoose from 'mongoose';
import { Project, IProjectDocument } from '../models/project.model';
import { Task } from '../models/task.model';
import { CreateProjectInput, UpdateProjectInput } from '../validators/workspace.validator';
import { AppError } from '../utils/appError';

export interface ProjectWithStatsDto {
  _id: string;
  name: string;
  description: string;
  color: string;
  status: string;
  dueDate: Date | null;
  userId: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProjectService {
  static async getProjects(userId: string): Promise<ProjectWithStatsDto[]> {
    const ownerId = new mongoose.Types.ObjectId(userId);

    const [projects, taskStats] = await Promise.all([
      Project.find({ userId: ownerId }).sort({ createdAt: -1 }),
      Task.aggregate([
        { $match: { userId: ownerId, projectId: { $ne: null } } },
        {
          $group: {
            _id: '$projectId',
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
            },
            inProgressTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
            },
            pendingTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'TODO'] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const statsMap = new Map<
      string,
      { totalTasks: number; completedTasks: number; inProgressTasks: number; pendingTasks: number }
    >();

    for (const s of taskStats) {
      statsMap.set(s._id.toString(), {
        totalTasks: s.totalTasks,
        completedTasks: s.completedTasks,
        inProgressTasks: s.inProgressTasks,
        pendingTasks: s.pendingTasks,
      });
    }

    return projects.map((p: IProjectDocument) => {
      const id = p._id.toString();
      const st = statsMap.get(id) || {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
      };
      const progress =
        st.totalTasks > 0 ? Math.round((st.completedTasks / st.totalTasks) * 100) : 0;

      return {
        _id: id,
        name: p.name,
        description: p.description || '',
        color: p.color || '#7C3AED',
        status: p.status,
        dueDate: p.dueDate || null,
        userId: p.userId.toString(),
        ...st,
        progress,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });
  }

  static async createProject(
    userId: string,
    input: CreateProjectInput
  ): Promise<ProjectWithStatsDto> {
    const project = await Project.create({
      ...input,
      userId,
    });

    return {
      _id: project._id.toString(),
      name: project.name,
      description: project.description || '',
      color: project.color,
      status: project.status,
      dueDate: project.dueDate || null,
      userId: project.userId.toString(),
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      progress: 0,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  static async updateProject(
    userId: string,
    projectId: string,
    input: UpdateProjectInput
  ): Promise<ProjectWithStatsDto> {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError(400, 'Invalid project ID');
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw new AppError(404, 'Project not found or unauthorized access');
    }

    const all = await this.getProjects(userId);
    const updated = all.find((p) => p._id === project._id.toString());
    return (
      updated || {
        _id: project._id.toString(),
        name: project.name,
        description: project.description || '',
        color: project.color,
        status: project.status,
        dueDate: project.dueDate || null,
        userId: project.userId.toString(),
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        progress: 0,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }
    );
  }

  static async deleteProject(userId: string, projectId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError(400, 'Invalid project ID');
    }

    const deleted = await Project.findOneAndDelete({ _id: projectId, userId });
    if (!deleted) {
      throw new AppError(404, 'Project not found or unauthorized access');
    }

    // Safely detach orphaned tasks so tasks are never lost
    await Task.updateMany(
      { userId, projectId: new mongoose.Types.ObjectId(projectId) },
      { $set: { projectId: null } }
    );
  }
}
