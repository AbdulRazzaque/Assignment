'use client';

import * as React from 'react';
import { dashboardService } from '../../../services/dashboard.service';
import { DashboardStats, MonthlyActivityItem, Task } from '../../../types';
import { StatCards } from '../../../components/dashboard/stat-cards';
import { ActivityChart } from '../../../components/dashboard/activity-chart';
import { StatusDistributionChart } from '../../../components/dashboard/status-distribution-chart';
import { RecentTasksCard } from '../../../components/dashboard/recent-tasks-card';
import { Skeleton } from '../../../components/ui/skeleton';
import { useTaskStore } from '../../../store/taskStore';
import { useAuthStore } from '../../../store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks } = useTaskStore();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [activity, setActivity] = React.useState<MonthlyActivityItem[]>([]);
  const [recentTasks, setRecentTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, activityData, recent] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getActivity(),
        dashboardService.getRecentTasks(6),
      ]);
      setStats(statsData);
      setActivity(activityData);
      setRecentTasks(recent);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboardData();
    fetchTasks();
  }, [loadDashboardData, fetchTasks]);

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 5 Real Metric KPI Cards matching Image 1 & Assessment requirements */}
      {stats && <StatCards stats={stats} />}

      {/* Middle Analytics Visualizations matching Image 1 */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Review Activity Bar Chart (2/3 width) */}
          <div className="lg:col-span-2">
            <ActivityChart activity={activity} />
          </div>

          {/* Task Status Distribution Donut Chart (1/3 width) */}
          <div>
            <StatusDistributionChart
              distribution={stats.statusDistribution}
              completionRate={stats.completionRate}
              overdueCount={stats.overdueTasks}
            />
          </div>
        </div>
      )}

      {/* Bottom Task Review List Table matching Image 1 */}
      <RecentTasksCard tasks={recentTasks.length > 0 ? recentTasks : tasks} />
    </div>
  );
}
