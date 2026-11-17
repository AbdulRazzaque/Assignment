'use client';

import * as React from 'react';
import { Plus, Download, Table as TableIcon, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
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
    tasks,
  } = useTaskStore();

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(tasks, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'taskflow_tasks_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col gap-6">
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
              onClick={() => alert('Calendar schedule view synced with MongoDB due dates.')}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 transition-all"
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
            New Project
          </button>

          {/* Export Data Button matching Image 4 */}
          <button
            onClick={handleExportData}
            className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
