'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowUpDown,
  CheckCircle,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';

export function TaskTable() {
  const router = useRouter();
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
    deleteTask,
  } = useTaskStore();

  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = React.useState<string[]>([]);

  // Assignee avatar faces matching Screen 5
  const assigneeFaces = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop&crop=faces',
  ];

  const handleToggleCheck = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    updateStatus(task._id, nextStatus);
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(tasks.map((t) => t._id));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkComplete = async () => {
    for (const id of selectedTaskIds) {
      await updateStatus(id, 'COMPLETED');
    }
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedTaskIds.length} tasks?`)) {
      for (const id of selectedTaskIds) {
        await deleteTask(id);
      }
      setSelectedTaskIds([]);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="space-y-3 p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
        <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
          <Clock className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No tasks found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          No tasks match your current filter criteria or none have been created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Bulk Action Toolbar */}
      {selectedTaskIds.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-[#7C3AED] text-white shadow-md animate-in fade-in-0 slide-in-from-top-2">
          <div className="text-xs font-bold">
            {selectedTaskIds.length} task{selectedTaskIds.length > 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-bold transition-colors"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Mark Completed
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-xs font-bold transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table Card matching Screen 5 */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header matching Screen 5 */}
            <thead className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/40">
              <tr>
                <th className="py-4 pl-5 pr-3 w-10">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      selectedTaskIds.length === tasks.length
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                        : 'border-slate-300 hover:border-brand-500 bg-white'
                    }`}
                  >
                    {selectedTaskIds.length === tasks.length && (
                      <Check className="h-3 w-3 stroke-[3]" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-3 font-bold text-slate-500">Task Title</th>
                <th className="py-4 px-3 font-bold text-slate-500">Category</th>
                <th className="py-4 px-3 font-bold text-slate-500">Priority</th>
                <th className="py-4 px-3 font-bold text-slate-500">Status</th>
                <th className="py-4 px-3 font-bold text-slate-500">Due Date</th>
                <th className="py-4 px-3 font-bold text-slate-500">Assignee</th>
                <th className="py-4 pr-5 pl-3 text-right font-bold text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {tasks.map((task, idx) => {
                const isDone = task.status === 'COMPLETED';
                const isSelected = selectedTaskIds.includes(task._id);
                const avatar = assigneeFaces[idx % assigneeFaces.length];

                // Format Due Date matching Screen 5: "Nov 20, 2026"
                let formattedDueDate = 'Nov 20, 2026';
                try {
                  const d = new Date(task.dueDate);
                  if (!isNaN(d.getTime())) {
                    formattedDueDate = format(d, 'MMM d, yyyy');
                  }
                } catch {
                  // ignore
                }

                // Category badge colors matching Screen 5
                const catLower = (task.category || 'design').toLowerCase();
                const categoryStyles =
                  catLower.includes('design')
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : catLower.includes('backend')
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : catLower.includes('frontend')
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : catLower.includes('devops')
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200';

                // Priority badge matching Screen 5
                const priorityStyles = {
                  HIGH: 'bg-rose-50 text-rose-600 border-rose-200',
                  MEDIUM: 'bg-orange-50 text-orange-600 border-orange-200',
                  LOW: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                }[task.priority] || 'bg-slate-100 text-slate-600 border-slate-200';

                // Status badge matching Screen 5
                const statusStyles = {
                  TODO: 'bg-amber-50 text-amber-700 border-amber-200',
                  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
                  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                }[task.status] || 'bg-amber-50 text-amber-700 border-amber-200';

                const statusLabel =
                  task.status === 'TODO'
                    ? 'Pending'
                    : task.status === 'IN_PROGRESS'
                    ? 'In Progress'
                    : 'Completed';

                return (
                  <tr
                    key={task._id}
                    className={`transition-colors group ${
                      isSelected ? 'bg-purple-50/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 pl-5 pr-3">
                      <button
                        type="button"
                        onClick={(e) => handleSelectRow(task._id, e)}
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                            : 'border-slate-300 hover:border-brand-500 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                    </td>

                    {/* Task Title (Click navigates to Screen 8 Task Details Page) */}
                    <td className="py-4 px-3 font-semibold text-slate-900 max-w-xs">
                      <Link
                        href={`/tasks/${task._id}`}
                        className={`hover:text-[#7C3AED] transition-colors block truncate ${
                          isDone ? 'line-through text-slate-400 font-normal' : ''
                        }`}
                      >
                        {task.title}
                      </Link>
                    </td>

                    {/* Category Badge matching Screen 5 */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${categoryStyles}`}
                      >
                        {task.category || 'Design'}
                      </span>
                    </td>

                    {/* Priority Badge matching Screen 5 */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${priorityStyles}`}
                      >
                        {task.priority === 'HIGH' ? 'High' : task.priority === 'MEDIUM' ? 'Medium' : 'Low'}
                      </span>
                    </td>

                    {/* Status Badge matching Screen 5 */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleCheck(task)}
                        title="Click to toggle status"
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border transition-all hover:scale-105 active:scale-95 ${statusStyles}`}
                      >
                        {statusLabel}
                      </button>
                    </td>

                    {/* Due Date matching Screen 5 */}
                    <td className="py-4 px-3 whitespace-nowrap text-slate-600 font-medium">
                      <span className={task.isOverdue ? 'text-rose-600 font-bold' : ''}>
                        {formattedDueDate}
                      </span>
                    </td>

                    {/* Assignee Avatar matching Screen 5 */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <img
                        src={avatar}
                        alt="Assignee"
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                      />
                    </td>

                    {/* 3 dots action menu matching Screen 5 */}
                    <td className="py-4 pr-5 pl-3 text-right whitespace-nowrap relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === task._id ? null : task._id)
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Popover Action Menu */}
                      {activeMenuId === task._id && (
                        <div className="absolute right-5 top-12 z-50 w-36 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 text-left animate-in fade-in-0 zoom-in-95">
                          <Link
                            href={`/tasks/${task._id}`}
                            onClick={() => setActiveMenuId(null)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Details
                          </Link>
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
      </div>

      {/* Pagination matching Screen 5 */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-900">
              {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{pagination.total}</span> tasks
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setFilters({ page: pagination.page - 1 })}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page number buttons */}
            {[...Array(Math.min(5, pagination.totalPages || 1))].map((_, i) => {
              const p = i + 1;
              const isCurrent = pagination.page === p;
              return (
                <button
                  key={p}
                  onClick={() => setFilters({ page: p })}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#7C3AED] text-white shadow-sm'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setFilters({ page: pagination.page + 1 })}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
