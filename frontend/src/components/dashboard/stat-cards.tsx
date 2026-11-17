'use client';

import * as React from 'react';
import { MoreVertical, AlertCircle, CheckCircle, Clock, PlayCircle } from 'lucide-react';
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
      growth: stats.totalTasks > 0 ? '↗ Active' : '0 Tasks',
      subtext: 'Total tasks in workspace',
      isOverdue: false,
    },
    {
      title: 'Tasks In Progress',
      iconType: 'circle-half',
      value: stats.inProgressTasks,
      growth: stats.inProgressTasks > 0 ? '↗ In Work' : 'None',
      subtext: 'Currently being worked on',
      isOverdue: false,
    },
    {
      title: 'In Review / To Do',
      iconType: 'circle-half',
      value: stats.pendingTasks,
      growth: stats.pendingTasks > 0 ? '↗ Pending' : 'None',
      subtext: 'Tasks waiting to start',
      isOverdue: false,
    },
    {
      title: 'Task Completion Rate',
      iconType: 'circle-dot',
      value: `${stats.completionRate}%`,
      growth: `${stats.completedTasks} Done`,
      subtext: 'Tasks marked completed',
      isOverdue: false,
    },
    {
      title: 'Overdue Tasks',
      iconType: 'alert',
      value: stats.overdueTasks,
      growth: stats.overdueTasks > 0 ? 'Action Needed' : 'On Track',
      subtext: stats.overdueTasks > 0 ? 'Past deadline' : 'No overdue tasks',
      isOverdue: stats.overdueTasks > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`flex flex-col justify-between rounded-2xl bg-white p-5 shadow-xs border transition-all hover:shadow-card ${
            card.isOverdue
              ? 'border-rose-200 bg-rose-50/20'
              : 'border-slate-100'
          }`}
        >
          {/* Card Header matching Image 1 */}
          <div className="flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-2">
              {card.iconType === 'circle-dot' ? (
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-slate-900 bg-white">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                </div>
              ) : card.iconType === 'alert' ? (
                <AlertCircle className={`h-3.5 w-3.5 ${card.isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border border-slate-900 bg-gradient-to-r from-slate-900 from-50% to-transparent to-50%" />
              )}
              <span className="text-xs font-bold text-slate-800 truncate">
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
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold ${
                card.isOverdue
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-[#ECFDF5] text-[#10B981]'
              }`}
            >
              {card.growth}
            </span>
          </div>

          {/* Subtext matching Image 1 */}
          <p className="text-xs text-slate-400 font-medium truncate">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}
