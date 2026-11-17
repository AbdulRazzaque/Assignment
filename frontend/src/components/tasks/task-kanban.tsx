'use client';

import * as React from 'react';
import { Task, TaskStatus } from '../../types';
import { PriorityBadge } from '../ui/badge';
import { formatDate } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';
import { Edit2, Trash2, Calendar, Plus, MoreHorizontal, GripVertical } from 'lucide-react';

export function TaskKanban() {
  const { tasks, updateStatus, setSelectedTask, setIsModalOpen, setIsDeleteModalOpen } =
    useTaskStore();

  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
  const [activeLane, setActiveLane] = React.useState<TaskStatus | null>(null);

  const columns: { status: TaskStatus; title: string; color: string; badgeCls: string }[] = [
    {
      status: 'TODO',
      title: 'To Do',
      color: 'border-t-amber-400 bg-amber-500/10',
      badgeCls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      status: 'IN_PROGRESS',
      title: 'In Progress',
      color: 'border-t-purple-500 bg-purple-500/10',
      badgeCls: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      status: 'COMPLETED',
      title: 'Completed',
      color: 'border-t-emerald-500 bg-emerald-500/10',
      badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeLane !== status) {
      setActiveLane(status);
    }
  };

  const handleDragLeave = () => {
    setActiveLane(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setActiveLane(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (taskId) {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== targetStatus) {
        await updateStatus(taskId, targetStatus);
      }
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleQuickAdd = (status: TaskStatus) => {
    setSelectedTask({
      _id: '',
      title: '',
      description: '',
      status,
      priority: 'MEDIUM',
      category: 'General',
      dueDate: new Date().toISOString().split('T')[0],
      userId: '',
      isOverdue: false,
      createdAt: '',
      updatedAt: '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        const isHovered = activeLane === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`flex flex-col rounded-3xl transition-all min-h-[580px] p-4 border ${
              isHovered
                ? 'bg-brand-50/60 border-brand-400 ring-2 ring-brand-400/20 shadow-md'
                : 'bg-slate-50/70 border-slate-200/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.color.split(' ')[1]}`} />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {col.title}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeCls}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => handleQuickAdd(col.status)}
                title="Add task to column"
                className="flex h-7 w-7 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-colors shadow-2xs"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Column Cards */}
            <div className="space-y-3.5 flex-1">
              {columnTasks.length === 0 ? (
                <div
                  onClick={() => handleQuickAdd(col.status)}
                  className="py-12 flex flex-col items-center justify-center text-center cursor-pointer text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl hover:border-brand-300 hover:bg-white/50 transition-colors"
                >
                  <Plus className="h-5 w-5 mb-1 text-slate-300" />
                  <span>Drop tasks here or click to add</span>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    className="group relative p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-card transition-all cursor-grab active:cursor-grabbing space-y-3"
                  >
                    {/* Drag indicator & Title */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0 mt-0.5" />
                        <h4 className="font-bold text-xs text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
                          {task.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(task)}
                          title="Edit"
                          className="p-1 text-slate-400 hover:text-brand-600 rounded"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task)}
                          title="Delete"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 pl-6">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata: Category, Priority, Due Date */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 pl-6 text-xs">
                      <div className="flex items-center gap-1.5">
                        <PriorityBadge priority={task.priority} />
                        {task.category && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {task.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>

                    {/* Quick Move Status Buttons */}
                    <div className="pt-1 flex items-center justify-end gap-1.5 text-[10px] pl-6">
                      {col.status !== 'TODO' && (
                        <button
                          onClick={() => updateStatus(task._id, 'TODO')}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          ← To Do
                        </button>
                      )}
                      {col.status !== 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateStatus(task._id, 'IN_PROGRESS')}
                          className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                        >
                          {col.status === 'TODO' ? 'Start →' : '← In Progress'}
                        </button>
                      )}
                      {col.status !== 'COMPLETED' && (
                        <button
                          onClick={() => updateStatus(task._id, 'COMPLETED')}
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
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
