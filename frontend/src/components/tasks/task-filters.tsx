'use client';

import * as React from 'react';
import { Plus, Download, RotateCcw, X } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { TaskStatus, TaskPriority } from '../../types';

export function TaskFilters() {
  const {
    filters,
    setFilters,
    resetFilters,
    viewMode,
    setViewMode,
    openCreateModal,
    tasks,
    projects,
    tags,
  } = useTaskStore();

  const handleExportCSV = () => {
    if (tasks.length === 0) {
      alert('No tasks to export.');
      return;
    }

    const headers = [
      'ID',
      'Title',
      'Description',
      'Category',
      'Priority',
      'Status',
      'Tags',
      'Due Date',
      'Created At',
    ];
    const rows = tasks.map((t) => [
      `"${t._id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.category || 'General'}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${(t.tags || []).join('; ')}"`,
      `"${new Date(t.dueDate).toLocaleDateString()}"`,
      `"${new Date(t.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `taskflow_pro_tasks_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const hasActiveFilters = Boolean(
    filters.status ||
      filters.priority ||
      filters.category ||
      filters.tag ||
      filters.projectId ||
      filters.search ||
      filters.dueDateFrom ||
      filters.dueDateTo
  );

  const activeProjectName = projects.find((p) => p._id === filters.projectId)?.name;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {viewMode === 'kanban'
              ? 'Kanban Board'
              : viewMode === 'calendar'
              ? 'Calendar Schedule'
              : 'My Tasks'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {viewMode === 'kanban'
              ? 'Drag and drop tasks across workflow stages.'
              : viewMode === 'calendar'
              ? 'View and schedule tasks across deadlines.'
              : 'Manage, filter, tag, and track your tasks.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              type="button"
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
              type="button"
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
              type="button"
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

          <button
            type="button"
            onClick={() =>
              openCreateModal({
                category: filters.category,
                projectId: filters.projectId,
                tags: filters.tag ? [filters.tag] : undefined,
              })
            }
            className="flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.status || ''}
            onChange={(e) =>
              setFilters({
                status: (e.target.value as TaskStatus) || undefined,
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="TODO">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) =>
              setFilters({
                priority: (e.target.value as TaskPriority) || undefined,
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filters.category || ''}
            onChange={(e) =>
              setFilters({
                category: e.target.value || undefined,
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Design">Design</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="DevOps">DevOps</option>
            <option value="Development">Development</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Others">Others</option>
          </select>

          {projects.length > 0 && (
            <select
              value={filters.projectId || ''}
              onChange={(e) =>
                setFilters({
                  projectId: e.target.value || undefined,
                  page: 1,
                })
              }
              className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none cursor-pointer"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {tags.length > 0 && (
            <select
              value={filters.tag || ''}
              onChange={(e) =>
                setFilters({
                  tag: e.target.value || undefined,
                  page: 1,
                })
              }
              className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none cursor-pointer"
            >
              <option value="">All Tags</option>
              {tags.map((t) => (
                <option key={t._id} value={t.name}>
                  #{t.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={filters.sortBy || 'dueDate'}
            onChange={(e) =>
              setFilters({
                sortBy: e.target.value as 'dueDate' | 'createdAt' | 'title' | 'priority',
                page: 1,
              })
            }
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none cursor-pointer"
          >
            <option value="createdAt">Newest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeProjectName || filters.tag || filters.search) && (
        <div className="flex flex-wrap items-center gap-2">
          {activeProjectName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200 text-xs font-bold">
              Project: {activeProjectName}
              <button
                type="button"
                onClick={() => setFilters({ projectId: undefined, page: 1 })}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.tag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              Tag: #{filters.tag}
              <button type="button" onClick={() => setFilters({ tag: undefined, page: 1 })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
              Search: &ldquo;{filters.search}&rdquo;
              <button type="button" onClick={() => setFilters({ search: undefined, page: 1 })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
