'use client';

import * as React from 'react';
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  RotateCcw,
  Table as TableIcon,
  FolderKanban,
  Calendar,
} from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { TaskStatus, TaskPriority } from '../../types';

export function TaskFilters() {
  const {
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    setIsModalOpen,
    setSelectedTask,
    tasks,
  } = useTaskStore();

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    if (tasks.length === 0) {
      alert('No tasks to export.');
      return;
    }

    const headers = ['ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Due Date', 'Created At'];
    const rows = tasks.map((t) => [
      `"${t._id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.category || 'General'}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${new Date(t.dueDate).toLocaleDateString()}"`,
      `"${new Date(t.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taskflow_pro_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const hasActiveFilters = Boolean(
    filters.status ||
    filters.priority ||
    filters.category ||
    filters.search ||
    filters.dueDateFrom ||
    filters.dueDateTo
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header Row matching Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Manage, filter and track your tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View switcher pills */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-purple-50 text-[#7C3AED] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-purple-50 text-[#7C3AED] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-purple-50 text-[#7C3AED] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Calendar
            </button>
          </div>

          {/* New Task Button matching Screen 5 (Vivid purple) */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Row matching Screen 5 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({
                status: (e.target.value as TaskStatus) || undefined,
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="TODO">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              setFilters({
                priority: (e.target.value as TaskPriority) || undefined,
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={filters.category || ''}
            onChange={(e) =>
              setFilters({
                category: e.target.value || undefined,
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 cursor-pointer"
          >
            <option value="">All Category</option>
            <option value="Design">Design</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="DevOps">DevOps</option>
          </select>

          {/* Due Date Sort */}
          <select
            value={filters.sortBy || 'dueDate'}
            onChange={(e) =>
              setFilters({
                sortBy: e.target.value as 'dueDate' | 'createdAt' | 'title' | 'priority',
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 cursor-pointer"
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Task Title</option>
            <option value="priority">Priority</option>
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Export Data */}
        <button
          onClick={handleExportCSV}
          title="Export CSV"
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-400" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
