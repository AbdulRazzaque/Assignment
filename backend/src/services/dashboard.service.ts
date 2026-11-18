import mongoose from 'mongoose';
import { Task } from '../models/task.model';
import { TaskDto } from './task.service';

export interface MonthlyActivityItem {
  month: string;
  monthIndex: number;
  year: number;
  approved: number;
  reviewed: number;
  todo: number;
  total: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  completionRate: number;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  priorityDistribution: Array<{
    priority: string;
    count: number;
    percentage: number;
  }>;
}

export class DashboardService {
  static async getStats(userId: string): Promise<DashboardStats> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();

    const [aggregateResult] = await Task.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $facet: {
          total: [{ $count: 'count' }],
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          priorityCounts: [
            {
              $group: {
                _id: '$priority',
                count: { $sum: 1 },
              },
            },
          ],
          overdue: [
            {
              $match: {
                dueDate: { $lt: now },
                status: { $ne: 'COMPLETED' },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const totalTasks = aggregateResult.total[0]?.count || 0;
    const overdueTasks = aggregateResult.overdue[0]?.count || 0;

    // Process status counts
    const statusMap: Record<string, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };

    aggregateResult.statusCounts.forEach((item: { _id: string; count: number }) => {
      statusMap[item._id] = item.count;
    });

    const completedTasks = statusMap.COMPLETED || 0;
    const pendingTasks = statusMap.TODO || 0;
    const inProgressTasks = statusMap.IN_PROGRESS || 0;

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const statusDistribution = [
      {
        status: 'TODO',
        count: statusMap.TODO,
        percentage: totalTasks > 0 ? Math.round((statusMap.TODO / totalTasks) * 100) : 0,
      },
      {
        status: 'IN_PROGRESS',
        count: statusMap.IN_PROGRESS,
        percentage:
          totalTasks > 0 ? Math.round((statusMap.IN_PROGRESS / totalTasks) * 100) : 0,
      },
      {
        status: 'COMPLETED',
        count: statusMap.COMPLETED,
        percentage:
          totalTasks > 0 ? Math.round((statusMap.COMPLETED / totalTasks) * 100) : 0,
      },
    ];

    // Process priority counts
    const priorityMap: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
    };

    aggregateResult.priorityCounts.forEach((item: { _id: string; count: number }) => {
      priorityMap[item._id] = item.count;
    });

    const priorityDistribution = [
      {
        priority: 'LOW',
        count: priorityMap.LOW,
        percentage: totalTasks > 0 ? Math.round((priorityMap.LOW / totalTasks) * 100) : 0,
      },
      {
        priority: 'MEDIUM',
        count: priorityMap.MEDIUM,
        percentage:
          totalTasks > 0 ? Math.round((priorityMap.MEDIUM / totalTasks) * 100) : 0,
      },
      {
        priority: 'HIGH',
        count: priorityMap.HIGH,
        percentage:
          totalTasks > 0 ? Math.round((priorityMap.HIGH / totalTasks) * 100) : 0,
      },
    ];

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      statusDistribution,
      priorityDistribution,
    };
  }

  static async getRecentTasks(userId: string, limit = 5): Promise<TaskDto[]> {
    const tasks = await Task.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    const now = new Date();
    return tasks.map((task) => ({
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
      isOverdue: new Date(task.dueDate) < now && task.status !== 'COMPLETED',
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  static async getUpcomingTasks(userId: string, limit = 5): Promise<TaskDto[]> {
    const now = new Date();
    const tasks = await Task.find({
      userId,
      status: { $ne: 'COMPLETED' },
      dueDate: { $gte: now },
    })
      .sort({ dueDate: 1 })
      .limit(limit);

    return tasks.map((task) => ({
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
      isOverdue: false,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  }

  static async getActivity(userId: string): Promise<MonthlyActivityItem[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const currentYear = new Date().getFullYear();

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Initialize 12 months with 0s
    const activityMap: Record<number, MonthlyActivityItem> = {};
    for (let i = 0; i < 12; i++) {
      activityMap[i + 1] = {
        month: monthNames[i],
        monthIndex: i + 1,
        year: currentYear,
        approved: 0,
        reviewed: 0,
        todo: 0,
        total: 0,
      };
    }

    const aggregation = await Task.aggregate([
      {
        $match: {
          userId: userObjectId,
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    aggregation.forEach((item: { _id: { month: number; status: string }; count: number }) => {
      const m = item._id.month;
      if (activityMap[m]) {
        if (item._id.status === 'COMPLETED') {
          activityMap[m].approved += item.count;
        } else if (item._id.status === 'IN_PROGRESS') {
          activityMap[m].reviewed += item.count;
        } else if (item._id.status === 'TODO') {
          activityMap[m].todo += item.count;
        }
        activityMap[m].total += item.count;
      }
    });

    return Object.values(activityMap);
  }
}
