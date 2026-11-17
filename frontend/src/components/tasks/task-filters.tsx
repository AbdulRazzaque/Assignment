'use client';

import * as React from 'react';
import {
  Plus,
  Download,
  Search,
  Filter,
  X,
  RotateCcw,
  Calendar as CalendarIcon,
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

  const [searchInput, setSearchInput] = React.useState(filters.search || '');
  const [showFilters, setShowFilters] = React.useState(false);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== (filters.search || '')) {
        setFilters({ search: searchInput || undefined, page: 1 });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters.search, setFilters]);

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
    link.setAttribute('download', `taskflow_tasks_${new Date().toISOString().split('T')[0]}.csv`);
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
      {/* Top Header Row matching Image 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Monitor all of your tasks here
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View switcher pills matching Image 4: Table, Kanban, Calendar */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-brand-50 text-brand-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-brand-50 text-brand-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-brand-50 text-brand-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Calendar
            </button>
          </div>

          {/* New Task Button matching Image 4 (Solid vivid purple) */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:opacity-95 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            + New Project
          </button>

          {/* Export Data Button matching Image 4 */}
          <button
            onClick={handleExportCSV}
            title="Download CSV report"
            className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks by name or description..."
            className="h-10 w-full pl-10 pr-9 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setFilters({ search: undefined, page: 1 });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({
                status: (e.target.value as TaskStatus) || undefined,
                page: 1,
              })
            }
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do (Pending)</option>
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
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High (Urgent)</option>
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
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="General">General</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Others">Others</option>
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchInput('');
                resetFilters();
              }}
              className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
