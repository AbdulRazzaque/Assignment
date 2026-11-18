'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Download,
  FileJson,
  Printer,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { dashboardService } from '../../../services/dashboard.service';
import { taskService } from '../../../services/task.service';
import { DashboardStats, MonthlyActivityItem, Task } from '../../../types';
import { Skeleton } from '../../../components/ui/skeleton';
import { useToast } from '../../../components/ui/toast';

type DateRange = 'ALL' | '30D' | '7D';

export default function ReportsPage() {
  const toast = useToast();

  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [activity, setActivity] = React.useState<MonthlyActivityItem[]>([]);
  const [allTasks, setAllTasks] = React.useState<Task[]>([]);
  const [range, setRange] = React.useState<DateRange>('ALL');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [st, act, taskRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getActivity(),
          taskService.getTasks({ limit: 100, page: 1 }),
        ]);
        setStats(st);
        setActivity(act);
        setAllTasks(taskRes.tasks);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [toast]);

  const scopedTasks = React.useMemo(() => {
    if (range === 'ALL') return allTasks;
    const days = range === '7D' ? 7 : 30;
    const cutoff = Date.now() - days * 86400000;
    return allTasks.filter((t) => new Date(t.createdAt).getTime() >= cutoff);
  }, [allTasks, range]);

  const metrics = React.useMemo(() => {
    const total = scopedTasks.length;
    const completed = scopedTasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgress = scopedTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = scopedTasks.filter((t) => t.status === 'TODO').length;
    const overdue = scopedTasks.filter((t) => t.isOverdue).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, todo, overdue, rate };
  }, [scopedTasks]);

  const priorityChartData = React.useMemo(() => {
    return [
      {
        name: 'High',
        total: scopedTasks.filter((t) => t.priority === 'HIGH').length,
        completed: scopedTasks.filter((t) => t.priority === 'HIGH' && t.status === 'COMPLETED')
          .length,
        color: '#EF4444',
      },
      {
        name: 'Medium',
        total: scopedTasks.filter((t) => t.priority === 'MEDIUM').length,
        completed: scopedTasks.filter((t) => t.priority === 'MEDIUM' && t.status === 'COMPLETED')
          .length,
        color: '#F59E0B',
      },
      {
        name: 'Low',
        total: scopedTasks.filter((t) => t.priority === 'LOW').length,
        completed: scopedTasks.filter((t) => t.priority === 'LOW' && t.status === 'COMPLETED')
          .length,
        color: '#10B981',
      },
    ];
  }, [scopedTasks]);

  const categoryChartData = React.useMemo(() => {
    const map = new Map<string, { name: string; total: number; completed: number }>();
    for (const t of scopedTasks) {
      const cat = t.category || 'General';
      const entry = map.get(cat) || { name: cat, total: 0, completed: 0 };
      entry.total += 1;
      if (t.status === 'COMPLETED') entry.completed += 1;
      map.set(cat, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [scopedTasks]);

  const statusPieData = React.useMemo(
    () => [
      { name: 'Completed', value: metrics.completed, color: '#7C3AED' },
      { name: 'In Progress', value: metrics.inProgress, color: '#3B82F6' },
      { name: 'Pending', value: metrics.todo, color: '#F59E0B' },
    ],
    [metrics]
  );

  const overdueTasks = React.useMemo(
    () =>
      scopedTasks
        .filter((t) => t.isOverdue)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [scopedTasks]
  );

  const handleExportCSV = () => {
    const headers = ['Title', 'Category', 'Priority', 'Status', 'Due Date', 'Overdue', 'Tags'];
    const rows = scopedTasks.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category || 'General'}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${format(new Date(t.dueDate), 'yyyy-MM-dd')}"`,
      `"${t.isOverdue ? 'Yes' : 'No'}"`,
      `"${(t.tags || []).join('; ')}"`,
    ]);
    const csv =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csv);
    a.download = `taskflow_report_${range.toLowerCase()}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('CSV Analytics Report downloaded');
  };

  const handleExportJSON = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      range,
      summary: metrics,
      priorityBreakdown: priorityChartData,
      categoryBreakdown: categoryChartData,
      monthlyActivity: activity,
      tasks: scopedTasks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow_analytics_${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('JSON Analytics Report downloaded');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Executive productivity metrics, throughput trends, and overdue risk diagnostics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Range Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            {(
              [
                { id: '7D', label: 'Last 7 Days' },
                { id: '30D', label: 'Last 30 Days' },
                { id: 'ALL', label: 'All Time' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRange(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  range === opt.id
                    ? 'bg-purple-50 text-[#7C3AED]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
          >
            <FileJson className="h-3.5 w-3.5" /> JSON
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-bold text-white shadow-sm shadow-purple-500/25"
          >
            <Printer className="h-3.5 w-3.5" /> Print PDF
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completion Rate</span>
            <span className="h-8 w-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{metrics.rate}%</p>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.completed} of {metrics.total} tasks shipped
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active In Progress</span>
            <span className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{metrics.inProgress}</p>
          <p className="text-[11px] text-slate-400 mt-1">{metrics.todo} waiting in backlog</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overdue Risk</span>
            <span className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-rose-600">{metrics.overdue}</p>
          <p className="text-[11px] text-slate-400 mt-1">Requires immediate attention</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Categories</span>
            <span className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{categoryChartData.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            All-time total: {stats?.totalTasks ?? allTasks.length}
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Throughput Bar Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Monthly Delivery Throughput
              </h3>
              <p className="text-xs text-slate-400">
                Completed vs. In Progress tasks across the year
              </p>
            </div>
            <BarChart3 className="h-4.5 w-4.5 text-[#7C3AED]" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="approved" name="Completed" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                <Bar dataKey="reviewed" name="In Progress" fill="#C4B5FD" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Workload Mix</h3>
            <p className="text-xs text-slate-400">Distribution by current task status</p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {statusPieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            {statusPieData.map((s) => (
              <div key={s.name} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-600">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>{s.name}</span>
                </div>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Priority Breakdown & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Priority Execution</h3>
            <p className="text-xs text-slate-400">Completion ratio across priority tiers</p>
          </div>
          <div className="space-y-4">
            {priorityChartData.map((item) => {
              const pct = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{item.name} Priority</span>
                    <span className="text-slate-500">
                      {item.completed}/{item.total} completed ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Category Performance</h3>
            <p className="text-xs text-slate-400">Task volume and completion by domain</p>
          </div>
          {categoryChartData.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No task data in this period.</p>
          ) : (
            <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
              {categoryChartData.map((cat) => {
                const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{cat.name}</span>
                      <span className="text-slate-500">
                        {cat.completed}/{cat.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#7C3AED] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Overdue Risk Table */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Overdue Risk Watchlist</h3>
            <p className="text-xs text-slate-400">
              Incomplete tasks past their due date requiring action
            </p>
          </div>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
          >
            Open My Tasks <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {overdueTasks.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <p className="text-xs font-bold text-slate-800">Zero Overdue Tasks</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Every task in this time range is on schedule.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400">
                <tr>
                  <th className="py-2.5 font-semibold">Task</th>
                  <th className="py-2.5 font-semibold">Category</th>
                  <th className="py-2.5 font-semibold">Priority</th>
                  <th className="py-2.5 font-semibold">Due Date</th>
                  <th className="py-2.5 text-right font-semibold">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overdueTasks.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-900">{t.title}</td>
                    <td className="py-3 text-slate-600">{t.category || 'General'}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-rose-600">
                      {format(new Date(t.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/tasks/${t._id}`}
                        className="text-[#7C3AED] font-bold hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
