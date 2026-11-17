'use client';

import * as React from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  MoreVertical,
  Flag,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';

export function TaskTable() {
  const {
    tasks,
    pagination,
    isLoading,
    setFilters,
    setSelectedTask,
    setIsModalOpen,
    setIsDeleteModalOpen,
    updateStatus,
  } = useTaskStore();

  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Assignees avatars matching Image 4
  const assigneeFaces = [
    [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces',
    ],
    [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces',
    ],
    [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces',
    ],
    [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces',
    ],
  ];

  const handleToggleCheck = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    updateStatus(task._id, nextStatus);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-3 p-6 bg-white rounded-3xl border border-slate-100 shadow-xs">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center">
        <div className="h-14 w-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
          <Clock className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No tasks created yet</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Click &ldquo;+ New Project&rdquo; above to create your first task and track deadlines.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table Card matching Image 4 */}
      <div className="overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <table className="w-full text-left text-xs">
          {/* Table Header matching Image 4 */}
          <thead className="border-b border-slate-100 text-slate-400 font-semibold">
            <tr>
              <th className="py-4 pl-6 pr-3 w-10">
                <div className="h-4 w-4 rounded-md border border-slate-300" />
              </th>
              <th className="py-4 px-3 font-semibold text-slate-400">Projects Name</th>
              <th className="py-4 px-3 font-semibold text-slate-400">Assignee</th>
              <th className="py-4 px-3 font-semibold text-slate-400">Priority</th>
              <th className="py-4 px-3 font-semibold text-slate-400">Start Date</th>
              <th className="py-4 px-3 font-semibold text-slate-400">Due Date</th>
              <th className="py-4 px-3 font-semibold text-slate-400">Status</th>
              <th className="py-4 pr-6 pl-3 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tasks.map((task, idx) => {
              const isDone = task.status === 'COMPLETED';
              const faces = assigneeFaces[idx % assigneeFaces.length];

              // Format date matching Image 4: "10 August, 2024"
              let formattedDueDate = '27 August, 2024';
              let formattedStartDate = '10 August, 2024';
              try {
                const d = new Date(task.dueDate);
                if (!isNaN(d.getTime())) {
                  formattedDueDate = format(d, 'd MMMM, yyyy');
                }
                const created = new Date(task.createdAt);
                if (!isNaN(created.getTime())) {
                  formattedStartDate = format(created, 'd MMMM, yyyy');
                }
              } catch {
                // fallback
              }

              // Priority pill matching Image 4
              const priorityConfig = {
                HIGH: { label: 'Urgent', color: 'text-rose-500 bg-rose-50/60' },
                MEDIUM: { label: 'Medium', color: 'text-purple-600 bg-purple-50/60' },
                LOW: { label: 'Low', color: 'text-slate-500 bg-slate-50/60' },
              }[task.priority] || { label: 'Medium', color: 'text-purple-600 bg-purple-50/60' };

              // Status badge matching Image 4
              const statusConfig = {
                TODO: { label: 'Pending', cls: 'text-amber-500 bg-amber-50' },
                IN_PROGRESS: { label: 'In Progress', cls: 'text-emerald-600 bg-emerald-50' },
                COMPLETED: { label: 'Review', cls: 'text-blue-600 bg-blue-50' },
              }[task.status] || { label: 'Pending', cls: 'text-amber-500 bg-amber-50' };

              return (
                <tr
                  key={task._id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Purple Checkbox matching Image 4 */}
                  <td className="py-4 pl-6 pr-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCheck(task)}
                      className={`flex h-4 w-4 items-center justify-center rounded transition-colors ${
                        isDone
                          ? 'bg-brand-600 text-white'
                          : 'border border-slate-300 hover:border-brand-500 bg-white'
                      }`}
                    >
                      {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                    </button>
                  </td>

                  {/* Project / Task Name */}
                  <td className="py-4 px-3 font-semibold text-slate-900 max-w-xs">
                    <span
                      className={`line-clamp-1 ${
                        isDone ? 'line-through text-slate-400 font-normal' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                  </td>

                  {/* Overlapping Assignee Avatars matching Image 4 */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex items-center -space-x-1.5">
                      {faces.map((avatar, fIdx) => (
                        <img
                          key={fIdx}
                          src={avatar}
                          alt="Assignee"
                          className="h-6 w-6 rounded-full object-cover ring-2 ring-white"
                        />
                      ))}
                    </div>
                  </td>

                  {/* Priority Flag badge matching Image 4 */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${priorityConfig.color}`}
                    >
                      <Flag className="h-3 w-3 fill-current" />
                      {priorityConfig.label}
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="py-4 px-3 whitespace-nowrap text-slate-600 font-medium">
                    {formattedStartDate}
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-3 whitespace-nowrap text-slate-600 font-medium">
                    {formattedDueDate}
                  </td>

                  {/* Status Pill matching Image 4 */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleCheck(task)}
                      title="Click to toggle status"
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${statusConfig.cls}`}
                    >
                      {statusConfig.label}
                    </button>
                  </td>

                  {/* 3 dots action menu matching Image 4 */}
                  <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === task._id ? null : task._id)
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeMenuId === task._id && (
                      <div className="absolute right-6 top-12 z-50 w-36 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 text-left animate-in fade-in-0 zoom-in-95">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            setSelectedTask(task);
                            setIsModalOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit Task
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            setSelectedTask(task);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Task
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-600">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-900">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{pagination.total}</span>{' '}
            tasks
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setFilters({ page: pagination.page - 1 })}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setFilters({ page: pagination.page + 1 })}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
