'use client';

import * as React from 'react';
import Link from 'next/link';
import { Task } from '../../types';
import { formatDate } from '../../lib/utils';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

interface RecentTasksCardProps {
  tasks: Task[];
}

export function RecentTasksCard({ tasks }: RecentTasksCardProps) {
  // Mock assignees to give realistic visual polish matching Image 1
  const assignees = [
    {
      name: 'Jaylon Dias',
      role: 'Technical writer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    },
    {
      name: 'Gretchen Vetrovs',
      role: 'Technical writer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    },
    {
      name: 'Ahmad Geidt',
      role: 'Technical writer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    },
    {
      name: 'Angel Donin',
      role: 'UI Designer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900">Task review List</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          This Month <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No tasks in review. Create a task from My Tasks to populate this list.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3 font-semibold pl-2">Task Name</th>
                <th className="pb-3 font-semibold">Assignee</th>
                <th className="pb-3 font-semibold">Submitted On</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Due Date</th>
                <th className="pb-3 font-semibold text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task, idx) => {
                const assignee = assignees[idx % assignees.length];
                const submittedDate = '01/12/2025 2:30:00 PM';

                // Priority styling matching Image 1
                const priorityStyles: Record<string, string> = {
                  LOW: 'text-slate-600 bg-slate-50 border-slate-200',
                  MEDIUM: 'text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]',
                  HIGH: 'text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0]',
                };

                // Status pill badge matching Image 1
                const statusStyles: Record<string, { label: string; cls: string }> = {
                  TODO: {
                    label: 'Pending',
                    cls: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
                  },
                  IN_PROGRESS: {
                    label: 'Revision Needed',
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
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Task Name & subtitle */}
                    <td className="py-4 pl-2 pr-4">
                      <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {task.description || 'Update and verify documentation for release'}
                      </p>
                    </td>

                    {/* Assignee Avatar + Role matching Image 1 */}
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">
                            {assignee.name}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-tight">
                            {assignee.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Submitted On Date */}
                    <td className="py-4 pr-4 whitespace-nowrap text-slate-600 font-medium text-[11px]">
                      {submittedDate}
                    </td>

                    {/* Priority Pill matching Image 1 */}
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${
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
                    <td className="py-4 pr-4 whitespace-nowrap text-slate-600 font-medium">
                      {formatDate(task.dueDate)}
                    </td>

                    {/* Status Pill matching Image 1 */}
                    <td className="py-4 pr-2 text-right whitespace-nowrap">
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
