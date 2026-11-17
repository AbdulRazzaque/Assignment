'use client';

import * as React from 'react';
import { Task } from '../../types';
import { PriorityBadge } from '../ui/badge';
import { formatDate } from '../../lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface UpcomingDeadlinesCardProps {
  tasks: Task[];
}

export function UpcomingDeadlinesCard({ tasks }: UpcomingDeadlinesCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Upcoming Deadlines
            </h3>
            <p className="text-xs text-slate-400">
              Critical deliverables due in the next days
            </p>
          </div>
          <Calendar className="h-4 w-4 text-brand-600" />
        </div>

        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No upcoming deadlines. You are all caught up!
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const diffDays = Math.ceil(
                (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="pr-3">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">
                      {task.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                      {diffDays <= 0 ? 'Today' : `${diffDays}d left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
