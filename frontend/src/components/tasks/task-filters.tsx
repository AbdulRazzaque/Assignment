'use client';

import * as React from 'react';
import { Search, Plus, Filter, LayoutGrid, Table as TableIcon, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { useTaskStore } from '../../store/taskStore';
import { TaskStatus, TaskPriority } from '../../types';

export function TaskFilters() {
  const {
    filters,
    setFilters,
    viewMode,
    setViewMode,
    setIsModalOpen,
    setSelectedTask,
  } = useTaskStore();

  const [searchValue, setSearchValue] = React.useState(filters.search || '');

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchValue || undefined, page: 1 });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchValue, setFilters]);

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header Row matching Image 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor, organize and prioritize all workflow tasks in real time
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Table / Kanban View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Board
            </button>
          </div>

          {/* New Task Button (Matching Image 4) */}
          <Button onClick={handleOpenCreateModal} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by title or description..."
            className="h-10 w-full pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) =>
            setFilters({
              status: (e.target.value as TaskStatus) || undefined,
              page: 1,
            })
          }
          className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do (Pending)</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) =>
            setFilters({
              priority: (e.target.value as TaskPriority) || undefined,
              page: 1,
            })
          }
          className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [
                'dueDate' | 'createdAt' | 'title' | 'priority',
                'asc' | 'desc'
              ];
              setFilters({ sortBy, sortOrder, page: 1 });
            }}
            className="h-10 w-full px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
