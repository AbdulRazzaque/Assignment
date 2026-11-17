'use client';

import * as React from 'react';
import { DashboardStats } from '../../types';

interface StatCardsProps {
  stats: DashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      growth: '+12%',
      growthColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      growth: '+28%',
      growthColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'In Progress',
      value: stats.inProgressTasks,
      growth: '+6%',
      growthColor: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Pending',
      value: stats.pendingTasks,
      growth: '-8%',
      growthColor: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      growth: stats.overdueTasks > 0 ? '+40%' : '0%',
      growthColor: 'text-rose-600 bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-2xl bg-white p-4 sm:p-5 shadow-xs border border-slate-100 hover:shadow-card transition-all"
        >
          {/* Card Title */}
          <span className="text-xs font-semibold text-slate-500 truncate">
            {card.title}
          </span>

          {/* Metric Value & Growth Pill matching Screen 4 */}
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {card.value}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${card.growthColor}`}
            >
              {card.growth}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
