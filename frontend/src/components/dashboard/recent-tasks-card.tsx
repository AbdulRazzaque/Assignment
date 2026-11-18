'use client';

import * as React from 'react';
import Link from 'next/link';
import { Task, TaskStatus } from '../../types';
import { ArrowUpRight, Plus, Check, Calendar, Flag } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { format } from 'date-fns';

interface RecentTasksCardProps {
  tasks: Task[];
  onStatusChanged?: () => void;
}

export function RecentTasksCard({ tasks, onStatusChanged }: RecentTasksCardProps) {
  const { openCreateModal, updateStatus } = useTaskStore();

  const handleToggleDone = async (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();
    const next: TaskStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    await updateStatus(task._id, next);
    if (onStatusChanged) onStatusChanged();
  };

  return (
    <div className="card-premium overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Task Review Queue</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Recent deliverables with instant status toggling
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm shadow-purple-500/20 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            View All <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">No tasks in your workspace yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Create your first task to see live completion velocity, charts, and deadline alerts.
          </p>
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/25"
          >
            <Plus className="h-3.5 w-3.5" /> Create First Task
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/60">
                <th className="py-3.5 pl-6 pr-3">Task</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Priority</th>
                <th className="py-3.5 px-3">Due Date</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90">
              {tasks.slice(0, 6).map((task) => {
                const isDone = task.status === 'COMPLETED';

                let formattedDue = '';
                try {
                  formattedDue = format(new Date(task.dueDate), 'MMM d, yyyy');
                } catch {
                  formattedDue = '—';
                }

                const priorityPill =
                  task.priority === 'HIGH'
                    ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                    : task.priority === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/80';

                const statusPill =
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                    : task.status === 'IN_PROGRESS'
                    ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                    : 'bg-amber-50 text-amber-700 border-amber-200/80';

                const statusDot =
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-500'
                    : task.status === 'IN_PROGRESS'
                    ? 'bg-blue-500'
                    : 'bg-amber-500';

                return (
                  <tr
                    key={task._id}
                    className="group hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="py-3.5 pl-6 pr-3 max-w-[260px]">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => handleToggleDone(e, task)}
                          title={isDone ? 'Mark pending' : 'Mark completed'}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                            isDone
                              ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-xs'
                              : 'border-slate-300 bg-white hover:border-[#7C3AED]'
                          }`}
                        >
                          {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                        </button>
                        <div className="min-w-0">
                          <Link
                            href={`/tasks/${task._id}`}
                            className={`font-bold text-slate-900 hover:text-[#7C3AED] transition-colors block truncate ${
                              isDone ? 'line-through text-slate-400 font-semibold' : ''
                            }`}
                          >
                            {task.title}
                          </Link>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                              {task.tags.slice(0, 2).map((tg) => (
                                <span
                                  key={tg}
                                  className="text-[10px] font-bold text-[#7C3AED]"
                                >
                                  #{tg}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {task.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${priorityPill}`}
                      >
                        <Flag className="h-2.5 w-2.5 fill-current" />
                        {task.priority === 'HIGH'
                          ? 'High'
                          : task.priority === 'MEDIUM'
                          ? 'Medium'
                          : 'Low'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap font-semibold text-slate-500">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          task.isOverdue ? 'text-rose-600 font-bold' : ''
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5 opacity-70" />
                        {formattedDue}
                      </span>
                    </td>

                    <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusPill}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                        {task.status === 'COMPLETED'
                          ? 'Completed'
                          : task.status === 'IN_PROGRESS'
                          ? 'In Progress'
                          : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
