'use client';

import * as React from 'react';
import {
  Layers,
  CheckCircle2,
  Zap,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { DashboardStats } from '../../types';

interface StatCardsProps {
  stats: DashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const total = stats.totalTasks || 0;
  const pctOfTotal = (val: number) => (total > 0 ? Math.round((val / total) * 100) : 0);

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      badge: `${stats.completionRate}% done`,
      subtitle: 'Active workspace volume',
      progress: stats.completionRate,
      icon: Layers,
      iconBg: 'bg-purple-50 text-[#7C3AED] ring-purple-100',
      badgeStyle: 'text-[#7C3AED] bg-purple-50 border-purple-200/70',
      barColor: 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7]',
      accentTop: 'from-[#7C3AED] to-[#A855F7]',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      badge: `${pctOfTotal(stats.completedTasks)}% share`,
      subtitle: 'Successfully shipped',
      progress: pctOfTotal(stats.completedTasks),
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
      badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200/70',
      barColor: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      accentTop: 'from-emerald-500 to-teal-400',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      badge: `${pctOfTotal(stats.inProgressTasks)}% active`,
      subtitle: 'Currently being worked on',
      progress: pctOfTotal(stats.inProgressTasks),
      icon: Zap,
      iconBg: 'bg-blue-50 text-blue-600 ring-blue-100',
      badgeStyle: 'text-blue-700 bg-blue-50 border-blue-200/70',
      barColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      accentTop: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Pending',
      value: stats.pendingTasks,
      badge: `${pctOfTotal(stats.pendingTasks)}% queue`,
      subtitle: 'Ready in backlog',
      progress: pctOfTotal(stats.pendingTasks),
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 ring-amber-100',
      badgeStyle: 'text-amber-700 bg-amber-50 border-amber-200/70',
      barColor: 'bg-gradient-to-r from-amber-500 to-orange-400',
      accentTop: 'from-amber-500 to-orange-400',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      badge: stats.overdueTasks > 0 ? 'Action needed' : 'All clear',
      subtitle: stats.overdueTasks > 0 ? 'Past target deadline' : 'Zero missed deadlines',
      progress: stats.overdueTasks > 0 ? Math.min(100, pctOfTotal(stats.overdueTasks) + 15) : 0,
      icon: AlertTriangle,
      iconBg:
        stats.overdueTasks > 0
          ? 'bg-rose-50 text-rose-600 ring-rose-100'
          : 'bg-slate-100 text-slate-500 ring-slate-200/60',
      badgeStyle:
        stats.overdueTasks > 0
          ? 'text-rose-700 bg-rose-50 border-rose-200/70'
          : 'text-emerald-700 bg-emerald-50 border-emerald-200/70',
      barColor: 'bg-gradient-to-r from-rose-500 to-pink-500',
      accentTop: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden card-premium-hover p-5 flex flex-col justify-between"
          >
            {/* Hover Gradient Hairline */}
            <div
              className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${card.accentTop} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Top Row: Icon & Badge */}
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${card.iconBg} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeStyle}`}
              >
                {card.badge}
              </span>
            </div>

            {/* Middle: Value & Title */}
            <div className="mt-4">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums font-display">
                {card.value}
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{card.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                {card.subtitle}
              </p>
            </div>

            {/* Bottom: Mini Animated Progress Track */}
            <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${card.barColor} transition-all duration-700 ease-out`}
                style={{ width: `${Math.max(card.value > 0 ? 8 : 0, card.progress)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
