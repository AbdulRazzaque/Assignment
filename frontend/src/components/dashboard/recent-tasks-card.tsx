'use client';

import * as React from 'react';
import Link from 'next/link';
import { Task } from '../../types';
import { formatDate } from '../../lib/utils';
import { ChevronDown, ArrowUpRight, Plus } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

interface RecentTasksCardProps {
  tasks: Task[];
}

export function RecentTasksCard({ tasks }: RecentTasksCardProps) {
  const { setSelectedTask, setIsModalOpen } = useTaskStore();
  const { user } = useAuthStore();

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Task review List</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Recently submitted and active tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
          <Link
            href="/tasks"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            View All <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center text-xs text-slate-400">
          <p className="mb-2">No tasks in review yet.</p>
          <button
            onClick={handleOpenCreate}
            className="text-xs font-bold text-[#7C3AED] hover:underline"
          >
            Create your first task now →
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/30">
                <th className="py-3 pl-3 font-semibold">Task Name</th>
                <th className="py-3 font-semibold">Assignee</th>
                <th className="py-3 font-semibold">Submitted On</th>
                <th className="py-3 font-semibold">Priority</th>
                <th className="py-3 font-semibold">Due Date</th>
                <th className="py-3 font-semibold text-right pr-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.slice(0, 6).map((task) => {
                // Real submitted date
                let submittedDate = 'Recently';
                try {
                  const d = new Date(task.createdAt);
                  if (!isNaN(d.getTime())) {
                    submittedDate = format(d, 'dd/MM/yyyy h:mm a');
                  }
                } catch {
                  // ignore
                }

                // Priority styling matching Image 1
                const priorityStyles: Record<string, string> = {
                  LOW: 'text-slate-600 bg-slate-50 border-slate-200',
                  MEDIUM: 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]',
                  HIGH: 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA]',
                };

                // Status pill badge matching Image 1
                const statusStyles: Record<string, { label: string; cls: string }> = {
                  TODO: {
                    label: 'Pending',
                    cls: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
                  },
                  IN_PROGRESS: {
                    label: 'In Progress',
                    cls: 'bg-[#FFEDD5] text-[#EA580C] border-[#FED7AA]',
                  },
                  COMPLETED: {
                    label: 'Approved',
                    cls: 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]',
                  },
                };

                const statusInfo = statusStyles[task.status] || statusStyles.TODO;

                return (
                  <tr
                    key={task._id}
                    onClick={() => handleRowClick(task)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* Task Name & category */}
                    <td className="py-3.5 pl-3 pr-4">
                      <p className="font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {task.description || (task.category ? `Category: ${task.category}` : 'Task details')}
                      </p>
                    </td>

                    {/* Assignee */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7C3AED] text-white font-bold text-[10px] uppercase">
                          {user?.name ? user.name.slice(0, 2) : 'TF'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">
                            {user?.name || 'Assignee'}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            Engineer
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Submitted On Date */}
                    <td className="py-3.5 pr-4 whitespace-nowrap text-slate-600 font-medium text-[11px]">
                      {submittedDate}
                    </td>

                    {/* Priority Pill matching Image 1 */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          priorityStyles[task.priority] || priorityStyles.MEDIUM
                        }`}
                      >
                        {task.priority === 'LOW'
                          ? 'Low'
                          : task.priority === 'HIGH'
                          ? 'High'
                          : 'Medium'}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 pr-4 whitespace-nowrap text-slate-600 font-medium">
                      <span className={task.isOverdue ? 'text-rose-600 font-bold' : ''}>
                        {formatDate(task.dueDate)}
                      </span>
                    </td>

                    {/* Status Pill matching Image 1 */}
                    <td className="py-3.5 pr-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${statusInfo.cls}`}
                      >
                        {statusInfo.label}
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
