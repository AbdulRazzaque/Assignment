'use client';

import * as React from 'react';
import {
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge, OverdueBadge } from '../ui/badge';
import { formatDate } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';
import { Skeleton } from '../ui/skeleton';

export function TaskTable() {
  const {
    tasks,
    pagination,
    isLoading,
    filters,
    setFilters,
    setSelectedTask,
    setIsModalOpen,
    setIsDeleteModalOpen,
    updateStatus,
  } = useTaskStore();

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleToggleCompleted = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    updateStatus(task._id, nextStatus);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-100">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80 text-center">
        <div className="h-12 w-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
          <Clock className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No tasks found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          No tasks match your current filters. Try resetting the search or create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Table matching Image 4 */}
      <div className="hidden md:block overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/70 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 pl-6 pr-3 w-10">
                <span className="sr-only">Check</span>
              </th>
              <th className="py-3.5 px-3">Task Name</th>
              <th className="py-3.5 px-3">Priority</th>
              <th className="py-3.5 px-3">Due Date</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isDone = task.status === 'COMPLETED';
              return (
                <tr
                  key={task._id}
                  className="group hover:bg-slate-50/70 transition-colors"
                >
                  {/* Quick Complete Toggle */}
                  <td className="py-4 pl-6 pr-3">
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(task)}
                      className="text-slate-300 hover:text-brand-600 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                  </td>

                  {/* Task Name & Description */}
                  <td className="py-4 px-3 max-w-md">
                    <p
                      className={`font-semibold text-slate-900 transition-colors ${
                        isDone ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Priority Badge */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Due Date & Overdue */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">
                        {formatDate(task.dueDate)}
                      </span>
                      {task.isOverdue && <OverdueBadge />}
                    </div>
                  </td>

                  {/* Quick Status Dropdown */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task._id, e.target.value as TaskStatus)
                      }
                      className="text-xs font-semibold rounded-lg border border-slate-200 py-1 px-2.5 bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-brand-500"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pr-6 pl-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(task)}
                        title="Edit Task"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        title="Delete Task"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToggleCompleted(task)}
                  className="text-slate-300 hover:text-brand-600"
                >
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <h4
                  className={`font-bold text-sm text-slate-900 ${
                    task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {task.title}
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(task)}
                  className="p-1 text-slate-400 hover:text-brand-600"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(task)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-slate-500">{task.description}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(task.dueDate)}</span>
                {task.isOverdue && <OverdueBadge />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-xs font-medium text-slate-600">
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

          <div className="flex items-center gap-1.5">
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
