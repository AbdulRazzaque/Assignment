'use client';

import * as React from 'react';
import { MoreVertical } from 'lucide-react';
import { DashboardStats } from '../../types';

interface StatCardsProps {
  stats: DashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Task Running',
      iconType: 'circle-dot',
      value: stats.totalTasks,
      growth: '↗ 10%',
      subtext: 'Tasks finished last month',
    },
    {
      title: 'Tasks In Progress',
      iconType: 'circle-half',
      value: stats.inProgressTasks,
      growth: '↗ 20%',
      subtext: 'Currently being worked on',
    },
    {
      title: 'In Review',
      iconType: 'circle-half',
      value: stats.pendingTasks,
      growth: '↗ 20%',
      subtext: 'Tasks reviewed last month',
    },
    {
      title: 'Task Completion Rate',
      iconType: 'circle-dot',
      value: `${stats.completionRate}%`,
      growth: '↗ 20%',
      subtext: '+3.2% Rate from last month',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-xs border border-slate-100 hover:shadow-card transition-all"
        >
          {/* Card Header matching Image 1 */}
          <div className="flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-2">
              {card.iconType === 'circle-dot' ? (
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-slate-900 bg-white">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                </div>
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border border-slate-900 bg-gradient-to-r from-slate-900 from-50% to-transparent to-50%" />
              )}
              <span className="text-xs font-bold text-slate-800">
                {card.title}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Value and growth pill matching Image 1 */}
          <div className="my-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {card.value}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] text-[#10B981]">
              {card.growth}
            </span>
          </div>

          {/* Subtext matching Image 1 */}
          <p className="text-xs text-slate-400 font-medium">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}
