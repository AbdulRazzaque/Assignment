'use client';

import * as React from 'react';
import Link from 'next/link';
import { dashboardService } from '../../../services/dashboard.service';
import { DashboardStats, MonthlyActivityItem, Task } from '../../../types';
import { StatCards } from '../../../components/dashboard/stat-cards';
import { ActivityChart } from '../../../components/dashboard/activity-chart';
import { StatusDistributionChart } from '../../../components/dashboard/status-distribution-chart';
import { RecentTasksCard } from '../../../components/dashboard/recent-tasks-card';
import { Skeleton } from '../../../components/ui/skeleton';
import { useTaskStore } from '../../../store/taskStore';
import { Plus, BarChart3, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { tasks, fetchTasks, openCreateModal } = useTaskStore();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [activity, setActivity] = React.useState<MonthlyActivityItem[]>([]);
  const [recentTasks, setRecentTasks] = React.useState<Task[]>([]);
  const [timeWindow, setTimeWindow] = React.useState<'ALL' | '30D' | '7D'>('30D');
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

  const filteredRecent = React.useMemo(() => {
    const source = recentTasks.length > 0 ? recentTasks : tasks;
    if (timeWindow === 'ALL') return source;
    const days = timeWindow === '7D' ? 7 : 30;
    const cutoff = Date.now() - days * 86400000;
    const subset = source.filter((t) => new Date(t.createdAt).getTime() >= cutoff);
    return subset.length > 0 ? subset : source;
  }, [recentTasks, tasks, timeWindow]);

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Here&apos;s what&apos;s happening across your workspace today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value as 'ALL' | '30D' | '7D')}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:border-[#7C3AED] focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="ALL">All Time</option>
          </select>

          <button
            type="button"
            onClick={loadDashboardData}
            title="Refresh metrics"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <BarChart3 className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>Full Report</span>
          </Link>

          <button
            type="button"
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 5 Real Metric KPI Cards */}
      {stats && <StatCards stats={stats} />}

      {/* Middle Analytics Visualizations */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ActivityChart activity={activity} />
          </div>

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
      <RecentTasksCard tasks={filteredRecent} />
    </div>
  );
}
