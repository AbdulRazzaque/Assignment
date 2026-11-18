'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dashboardService } from '../../../services/dashboard.service';
import { DashboardStats, MonthlyActivityItem, Task } from '../../../types';
import { StatCards } from '../../../components/dashboard/stat-cards';
import { ActivityChart } from '../../../components/dashboard/activity-chart';
import { StatusDistributionChart } from '../../../components/dashboard/status-distribution-chart';
import { RecentTasksCard } from '../../../components/dashboard/recent-tasks-card';
import { WorkspacePulseCard } from '../../../components/dashboard/workspace-pulse-card';
import { Skeleton } from '../../../components/ui/skeleton';
import { useTaskStore } from '../../../store/taskStore';
import { useAuthStore } from '../../../store/authStore';
import {
  Plus,
  BarChart3,
  RefreshCw,
  FolderKanban,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tasks, projects, fetchTasks, fetchProjects, openCreateModal, setViewMode } =
    useTaskStore();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [activity, setActivity] = React.useState<MonthlyActivityItem[]>([]);
  const [recentTasks, setRecentTasks] = React.useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = React.useState<Task[]>([]);
  const [timeWindow, setTimeWindow] = React.useState<'ALL' | '30D' | '7D'>('30D');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, activityData, recent, upcoming] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getActivity(),
        dashboardService.getRecentTasks(6),
        dashboardService.getUpcomingTasks(5),
      ]);
      setStats(statsData);
      setActivity(activityData);
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
    fetchTasks();
    fetchProjects();
  }, [loadDashboardData, fetchTasks, fetchProjects]);

  const greeting = React.useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

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
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-80 lg:col-span-7 rounded-2xl" />
          <Skeleton className="h-80 lg:col-span-5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const completionRate = stats?.completionRate ?? 0;
  const ringCircumference = 2 * Math.PI * 34;

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Command Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E0E1A] via-[#1B1338] to-[#2E1065] p-6 sm:p-8 text-white shadow-elevated border border-white/10">
        {/* Ambient Glows & Dot Grid */}
        <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-70" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#7C3AED]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Greeting & Controls */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-purple-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              <span>Workspace Command Center · Live Sync</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {greeting}, {user?.name?.split(' ')[0] || 'Abdul'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300/90 mt-1.5 leading-relaxed">
                You have{' '}
                <strong className="text-white">{stats?.inProgressTasks ?? 0} in-progress</strong>{' '}
                and <strong className="text-white">{stats?.pendingTasks ?? 0} pending</strong>{' '}
                tasks across <strong className="text-white">{projects.length} projects</strong>.
                {stats && stats.overdueTasks > 0 ? (
                  <>
                    {' '}
                    <span className="text-rose-300 font-bold">
                      {stats.overdueTasks} overdue item{stats.overdueTasks > 1 ? 's' : ''} need
                      attention.
                    </span>
                  </>
                ) : (
                  <span className="text-emerald-300 font-semibold">
                    {' '}
                    All deadlines are currently on track.
                  </span>
                )}
              </p>
            </div>

            {/* Quick Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => openCreateModal()}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-glow transition-all active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Create Task</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('kanban');
                  router.push('/tasks');
                }}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold backdrop-blur-sm transition-colors"
              >
                <FolderKanban className="h-3.5 w-3.5 text-purple-300" />
                <span>Kanban Board</span>
              </button>

              <Link
                href="/reports"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold backdrop-blur-sm transition-colors"
              >
                <BarChart3 className="h-3.5 w-3.5 text-purple-300" />
                <span>Analytics</span>
              </Link>

              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value as 'ALL' | '30D' | '7D')}
                className="h-9 px-3 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold focus:outline-none cursor-pointer [&>option]:text-slate-900"
              >
                <option value="7D">Last 7 Days</option>
                <option value="30D">Last 30 Days</option>
                <option value="ALL">All Time</option>
              </select>

              <button
                type="button"
                onClick={loadDashboardData}
                title="Refresh metrics"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-purple-200 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right: Live Radial Velocity Card */}
          <div className="flex items-center gap-4 self-start lg:self-center rounded-2xl bg-white/[0.07] border border-white/15 p-4 backdrop-blur-md">
            <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
              <svg className="h-20 w-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#A855F7"
                  strokeWidth="7"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={
                    ringCircumference - (ringCircumference * completionRate) / 100
                  }
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-lg font-extrabold text-white tabular-nums font-display">
                {completionRate}%
              </span>
            </div>
            <div className="pr-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                Sprint Velocity
              </p>
              <p className="text-base font-extrabold text-white mt-0.5 tabular-nums">
                {stats?.completedTasks ?? 0} / {stats?.totalTasks ?? 0}
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">Tasks delivered</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 5 Elevated Bento KPI Cards */}
      {stats && <StatCards stats={stats} />}

      {/* Analytics Bento Row */}
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

      {/* Bottom Executive Bento: Review Table (8 cols) + Active Projects & Deadlines Pulse (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RecentTasksCard tasks={filteredRecent} onStatusChanged={loadDashboardData} />
        </div>
        <div className="lg:col-span-4">
          <WorkspacePulseCard projects={projects} upcomingTasks={upcomingTasks} />
        </div>
      </div>
    </div>
  );
}
