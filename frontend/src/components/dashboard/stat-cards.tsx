import * as React from 'react';
import {
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  Activity,
} from 'lucide-react';
import { DashboardStats } from '../../types';

interface StatCardsProps {
  stats: DashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      subtext: 'All system tasks recorded',
      change: '+10%',
      icon: Activity,
      borderColor: 'border-brand-100',
      badgeBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Tasks In Progress',
      value: stats.inProgressTasks,
      subtext: 'Currently being actively worked on',
      change: '+20%',
      icon: Clock,
      borderColor: 'border-purple-100',
      badgeBg: 'bg-brand-50 text-brand-700',
    },
    {
      title: 'Pending (To Do)',
      value: stats.pendingTasks,
      subtext: 'Queued for development',
      change: 'Active',
      icon: TrendingUp,
      borderColor: 'border-amber-100',
      badgeBg: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Task Completion Rate',
      value: `${stats.completionRate}%`,
      subtext: `${stats.completedTasks} tasks finalized successfully`,
      change: stats.overdueTasks > 0 ? `${stats.overdueTasks} Overdue` : 'On Track',
      icon: CheckCircle,
      borderColor: 'border-emerald-100',
      badgeBg: stats.overdueTasks > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-card border border-slate-100 transition-all hover:shadow-elevated"
          >
            <div className="flex items-center justify-between text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-slate-900" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="my-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {card.value}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${card.badgeBg}`}
              >
                ↗ {card.change}
              </span>
            </div>

            <p className="text-xs text-slate-400">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
