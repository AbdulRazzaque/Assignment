'use client';

import * as React from 'react';
import { dashboardService } from '../../../services/dashboard.service';
import { DashboardStats, Task } from '../../../types';
import { StatCards } from '../../../components/dashboard/stat-cards';
import { ActivityChart } from '../../../components/dashboard/activity-chart';
import { StatusDistributionChart } from '../../../components/dashboard/status-distribution-chart';
import { RecentTasksCard } from '../../../components/dashboard/recent-tasks-card';
import { UpcomingDeadlinesCard } from '../../../components/dashboard/upcoming-deadlines-card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { useTaskStore } from '../../../store/taskStore';
import { useAuthStore } from '../../../store/authStore';
import { Plus, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { setIsModalOpen, setSelectedTask } = useTaskStore();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = React.useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, recent, upcoming] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentTasks(5),
        dashboardService.getUpcomingTasks(5),
      ]);
      setStats(statsData);
      setRecentTasks(recent);
      setUpcomingTasks(upcoming);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Team'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Here is your live productivity summary and sprint metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            title="Refresh metrics"
            className="gap-1.5 text-xs text-slate-600"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <Button onClick={handleCreateTask} size="sm" className="gap-1.5 shadow-sm">
            <Plus className="h-3.5 w-3.5" />
            New Task
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* KPI Stat Cards matching Image 1 */}
      {stats && <StatCards stats={stats} />}

      {/* Analytics Visualizations matching Image 1 */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart
              completedCount={stats.completedTasks}
              inProgressCount={stats.inProgressTasks}
              pendingCount={stats.pendingTasks}
            />
          </div>
          <div>
            <StatusDistributionChart
              distribution={stats.statusDistribution}
              completionRate={stats.completionRate}
            />
          </div>
        </div>
      )}

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTasksCard tasks={recentTasks} />
        </div>
        <div>
          <UpcomingDeadlinesCard tasks={upcomingTasks} />
        </div>
      </div>
    </div>
  );
}
