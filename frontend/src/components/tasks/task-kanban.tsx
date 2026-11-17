'use client';

import * as React from 'react';
import Link from 'next/link';
import { Task, TaskStatus } from '../../types';
import { formatDate } from '../../lib/utils';
import { useTaskStore } from '../../store/taskStore';
import {
  MoreHorizontal,
  Plus,
  GripVertical,
  Calendar,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export function TaskKanban() {
  const { tasks, updateStatus, setSelectedTask, setIsModalOpen, setIsDeleteModalOpen } =
    useTaskStore();

  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
  const [activeLane, setActiveLane] = React.useState<TaskStatus | null>(null);

  const columns: {
    status: TaskStatus;
    title: string;
    dotColor: string;
    headerBg: string;
    badgeStyle: string;
  }[] = [
    {
      status: 'TODO',
      title: 'To Do',
      dotColor: 'bg-amber-400',
      headerBg: 'bg-amber-50/70 text-amber-900 border-amber-200/60',
      badgeStyle: 'bg-amber-100 text-amber-800',
    },
    {
      status: 'IN_PROGRESS',
      title: 'In Progress',
      dotColor: 'bg-blue-500',
      headerBg: 'bg-blue-50/70 text-blue-900 border-blue-200/60',
      badgeStyle: 'bg-blue-100 text-blue-800',
    },
    {
      status: 'COMPLETED',
      title: 'Completed',
      dotColor: 'bg-emerald-500',
      headerBg: 'bg-emerald-50/70 text-emerald-900 border-emerald-200/60',
      badgeStyle: 'bg-emerald-100 text-emerald-800',
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

  const handleQuickAdd = (status: TaskStatus) => {
    setSelectedTask({
      _id: '',
      title: '',
      description: '',
      status,
      priority: 'MEDIUM',
      category: 'Design',
      dueDate: new Date().toISOString().split('T')[0],
      userId: '',
      isOverdue: false,
      createdAt: '',
      updatedAt: '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Kanban Header matching Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kanban Board
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Drag and drop tasks to update their status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
            <span>All Members</span>
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs">
            <Filter className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleQuickAdd('TODO')}
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 3 Columns matching Screen 6 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status);
          const isHovered = activeLane === col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
              className={`flex flex-col rounded-2xl transition-all min-h-[580px] p-3.5 border ${
                isHovered
                  ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-400/20 shadow-md'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              {/* Column Header matching Screen 6 */}
              <div className="flex items-center justify-between pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                    {col.title} ({columnTasks.length})
                  </h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {columnTasks.map((task) => {
                  const isCompleted = task.status === 'COMPLETED';

                  // Category styling matching Screen 6
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

                  // Priority styling matching Screen 6
                  const priorityStyles = {
                    HIGH: 'bg-rose-50 text-rose-600 border-rose-200',
                    MEDIUM: 'bg-orange-50 text-orange-600 border-orange-200',
                    LOW: 'bg-emerald-50 text-emerald-600 border-emerald-200',
                  }[task.priority] || 'bg-slate-100 text-slate-600 border-slate-200';

                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className="group p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-card transition-all cursor-grab active:cursor-grabbing space-y-2.5"
                    >
                      {/* Card Title & Checkmark */}
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/tasks/${task._id}`}
                          className={`font-bold text-xs text-slate-900 group-hover:text-[#7C3AED] transition-colors leading-snug line-clamp-2 ${
                            isCompleted ? 'line-through text-slate-400 font-normal' : ''
                          }`}
                        >
                          {task.title}
                        </Link>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        )}
                      </div>

                      {/* Badges: Category & Priority matching Screen 6 */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${categoryStyles}`}
                        >
                          {task.category || 'Design'}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${priorityStyles}`}
                        >
                          {task.priority === 'HIGH' ? 'High' : task.priority === 'MEDIUM' ? 'Medium' : 'Low'}
                        </span>
                      </div>

                      {/* Due Date & Assignee avatar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-[9px] uppercase">
                          AR
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom "+ Add Task" button matching Screen 6 */}
              <button
                onClick={() => handleQuickAdd(col.status)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-slate-300 text-xs font-bold text-slate-500 hover:text-[#7C3AED] hover:border-purple-300 hover:bg-white transition-all shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
