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
import { ChevronDown } from 'lucide-react';

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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-80 lg:col-span-7 rounded-2xl" />
          <Skeleton className="h-80 lg:col-span-5 rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header matching Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Here&apos;s what&apos;s happening with your work today.
          </p>
        </div>

        <button className="flex items-center gap-2 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto">
          <span>Last 30 Days</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 5 Real Metric KPI Cards matching Screen 4 */}
      {stats && <StatCards stats={stats} />}

      {/* Middle Analytics Visualizations matching Screen 4 */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Task Completion Trend Area Chart (7 cols) */}
          <div className="lg:col-span-7">
            <ActivityChart activity={activity} />
          </div>

          {/* Task Status Distribution Donut Chart (5 cols) */}
          <div className="lg:col-span-5">
            <StatusDistributionChart
              distribution={stats.statusDistribution}
              completionRate={stats.completionRate}
              overdueCount={stats.overdueTasks}
            />
          </div>
        </div>
      )}

      {/* Bottom Task Review List Table */}
      <RecentTasksCard tasks={recentTasks.length > 0 ? recentTasks : tasks} />
    </div>
  );
}
