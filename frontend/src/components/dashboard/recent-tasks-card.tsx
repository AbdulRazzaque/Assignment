'use client';

import * as React from 'react';
import Link from 'next/link';
import { Task } from '../../types';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../ui/badge';
import { formatDate } from '../../lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface RecentTasksCardProps {
  tasks: Task[];
}

export function RecentTasksCard({ tasks }: RecentTasksCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-card border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Recent Task Activity
          </h3>
          <p className="text-xs text-slate-400">
            Latest tasks assigned and updated across your workflow
          </p>
        </div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          View all tasks <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No recent tasks created yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Task Name</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Due Date</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <tr key={task._id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="py-3.5 pr-4 whitespace-nowrap text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>{formatDate(task.dueDate)}</span>
                      {task.isOverdue && <OverdueBadge />}
                    </div>
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
