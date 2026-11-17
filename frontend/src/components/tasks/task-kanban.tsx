'use client';

import * as React from 'react';
import { Task, TaskStatus } from '../../types';
import { PriorityBadge, OverdueBadge } from '../ui/badge';
import { formatDate } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';
import { Edit2, Trash2, Calendar, Plus } from 'lucide-react';

export function TaskKanban() {
  const { tasks, updateStatus, setSelectedTask, setIsModalOpen, setIsDeleteModalOpen } =
    useTaskStore();

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'TODO', title: 'To Do', color: 'border-t-amber-400 bg-amber-500/10' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-purple-500 bg-purple-500/10' },
    { status: 'COMPLETED', title: 'Completed', color: 'border-t-emerald-500 bg-emerald-500/10' },
  ];

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div
            key={col.status}
            className="flex flex-col rounded-2xl bg-slate-50/70 border border-slate-200/80 p-4"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.color.split(' ')[1]}`} />
                <h3 className="text-sm font-bold text-slate-900">{col.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  No tasks in this lane
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-card transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1 text-slate-400 hover:text-brand-600 rounded"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <PriorityBadge priority={task.priority} />
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>

                    {/* Quick Move Status Buttons */}
                    <div className="pt-1 flex items-center gap-1 text-[10px]">
                      {col.status !== 'TODO' && (
                        <button
                          onClick={() => updateStatus(task._id, 'TODO')}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          ← To Do
                        </button>
                      )}
                      {col.status !== 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateStatus(task._id, 'IN_PROGRESS')}
                          className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"
                        >
                          {col.status === 'TODO' ? 'Start →' : '← In Progress'}
                        </button>
                      )}
                      {col.status !== 'COMPLETED' && (
                        <button
                          onClick={() => updateStatus(task._id, 'COMPLETED')}
                          className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          Done ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
