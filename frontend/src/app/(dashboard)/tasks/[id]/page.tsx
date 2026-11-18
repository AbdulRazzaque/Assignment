'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  Flag,
  Calendar,
  Clock,
  User as UserIcon,
  FolderTree,
  FolderGit2,
  Edit2,
  Trash2,
  Check,
  Plus,
  Hash,
  Activity as ActivityIcon,
  X,
} from 'lucide-react';
import { taskService } from '../../../../services/task.service';
import { SubtaskItem, Task, TaskStatus } from '../../../../types';
import { useTaskStore } from '../../../../store/taskStore';
import { useAuthStore } from '../../../../store/authStore';
import { useToast } from '../../../../components/ui/toast';
import { Skeleton } from '../../../../components/ui/skeleton';
import { format } from 'date-fns';

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const {
    projects,
    tags: workspaceTags,
    setSelectedTask,
    setIsModalOpen,
    setIsDeleteModalOpen,
    updateStatus,
    fetchProjects,
    fetchTags,
  } = useTaskStore();
  const { user } = useAuthStore();

  const taskId = params?.id as string;
  const [task, setTask] = React.useState<Task | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'subtasks' | 'activity'>(
    'overview'
  );
  const [subtasks, setSubtasks] = React.useState<SubtaskItem[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');
  const [isSavingSubtasks, setIsSavingSubtasks] = React.useState(false);

  const loadTask = React.useCallback(async () => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const data = await taskService.getTaskById(taskId);
      setTask(data);
      setSubtasks(Array.isArray(data.subtasks) ? data.subtasks : []);
    } catch {
      router.push('/tasks');
    } finally {
      setIsLoading(false);
    }
  }, [taskId, router]);

  React.useEffect(() => {
    loadTask();
    fetchProjects();
    fetchTags();
  }, [loadTask, fetchProjects, fetchTags]);

  const persistSubtasks = async (nextSubtasks: SubtaskItem[]) => {
    if (!task) return;
    const prev = subtasks;
    setSubtasks(nextSubtasks);
    setIsSavingSubtasks(true);
    try {
      const updated = await taskService.updateTask(task._id, {
        subtasks: nextSubtasks.map((s) => ({ title: s.title, completed: s.completed })),
      });
      setTask(updated);
      setSubtasks(updated.subtasks || []);
    } catch (err: unknown) {
      setSubtasks(prev);
      toast.error(err instanceof Error ? err.message : 'Failed to save checklist');
    } finally {
      setIsSavingSubtasks(false);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const next = [...subtasks, { title: newSubtaskTitle.trim(), completed: false }];
    setNewSubtaskTitle('');
    await persistSubtasks(next);
  };

  const handleToggleSubtask = async (idx: number) => {
    const next = subtasks.map((s, i) => (i === idx ? { ...s, completed: !s.completed } : s));
    await persistSubtasks(next);
  };

  const handleRemoveSubtask = async (idx: number) => {
    const next = subtasks.filter((_, i) => i !== idx);
    await persistSubtasks(next);
  };

  const handleQuickStatus = async (status: TaskStatus) => {
    if (!task) return;
    try {
      await updateStatus(task._id, status);
      setTask({ ...task, status });
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const completedSubtasksCount = subtasks.filter((s) => s.completed).length;
  const progressPercent =
    subtasks.length > 0
      ? Math.round((completedSubtasksCount / subtasks.length) * 100)
      : task?.status === 'COMPLETED'
      ? 100
      : task?.status === 'IN_PROGRESS'
      ? 50
      : 0;

  if (isLoading || !task) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-96 lg:col-span-8 rounded-2xl" />
          <Skeleton className="h-96 lg:col-span-4 rounded-2xl" />
        </div>
      </div>
    );
  }

  const linkedProject = projects.find((p) => p._id === task.projectId);

  let formattedCreated = '';
  let formattedUpdated = '';
  let formattedDue = '';
  try {
    formattedCreated = format(new Date(task.createdAt), 'MMM d, yyyy, hh:mm a');
    formattedUpdated = format(new Date(task.updatedAt), 'MMM d, yyyy, hh:mm a');
    formattedDue = format(new Date(task.dueDate), 'MMM d, yyyy');
  } catch {
    // ignore
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/tasks" className="hover:text-slate-900 transition-colors">
          My Tasks
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-800 font-bold truncate max-w-xs">{task.title}</span>
      </div>

      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="space-y-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {task.title}
          </h1>

          {/* Meta Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={task.status}
              onChange={(e) => handleQuickStatus(e.target.value as TaskStatus)}
              className={`h-7 px-3 rounded-full text-xs font-bold border cursor-pointer focus:outline-none ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <option value="TODO">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                task.priority === 'HIGH'
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : task.priority === 'MEDIUM'
                  ? 'bg-orange-50 text-orange-600 border-orange-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}
            >
              <Flag className="h-3 w-3 fill-current" />
              <span>
                {task.priority === 'HIGH'
                  ? 'High'
                  : task.priority === 'MEDIUM'
                  ? 'Medium'
                  : 'Low'}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/80">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Due: {formattedDue}</span>
            </span>

            {linkedProject && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#7C3AED] border border-purple-200">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: linkedProject.color }}
                />
                {linkedProject.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 h-10 px-5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all active:scale-95"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Task</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTask(task);
              setIsDeleteModalOpen(true);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors shadow-2xs"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 px-2 text-xs font-bold text-slate-500">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'subtasks', label: `Subtasks (${completedSubtasksCount}/${subtasks.length})` },
            { id: 'activity', label: 'Activity Timeline' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 relative transition-colors ${
              activeTab === tab.id ? 'text-[#7C3AED]' : 'hover:text-slate-800'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'activity' ? (
            <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-5">
              <div className="flex items-center gap-2">
                <ActivityIcon className="h-4 w-4 text-[#7C3AED]" />
                <h3 className="text-sm font-extrabold text-slate-900">Task Activity Audit</h3>
              </div>
              <div className="space-y-4 border-l-2 border-purple-100 pl-4 ml-2">
                <div className="relative">
                  <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
                  <p className="text-xs font-bold text-slate-800">Task Created</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Created by {user?.name || 'Owner'} on {formattedCreated}
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <p className="text-xs font-bold text-slate-800">Last Updated</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Modified on {formattedUpdated} · Current status: {task.status}
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-xs font-bold text-slate-800">Scheduled Deadline</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Due on {formattedDue} {task.isOverdue ? '(Overdue)' : '(On track)'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Description */}
              <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {task.description ||
                    'No description added yet. Click "Edit Task" to document specifications or acceptance criteria.'}
                </p>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-slate-400 mr-1" />
                    {task.tags.map((tagName) => {
                      const found = workspaceTags.find((t) => t.name === tagName);
                      return (
                        <span
                          key={tagName}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
                          style={{ backgroundColor: found?.color || '#7C3AED' }}
                        >
                          #{tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Task Information Grid */}
              <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Task Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Created by
                      </span>
                      <span className="font-extrabold text-slate-800">
                        {user?.name || 'Workspace Owner'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Last Updated
                      </span>
                      <span className="font-extrabold text-slate-800">{formattedUpdated}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <FolderGit2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Project
                      </span>
                      <span className="font-extrabold text-slate-800">
                        {linkedProject ? linkedProject.name : 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <FolderTree className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Category
                      </span>
                      <span className="font-extrabold text-slate-800">
                        {task.category || 'General'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column (5 cols): Progress & Real MongoDB Subtasks Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Progress & Checklist
              </h3>
              {isSavingSubtasks && (
                <span className="text-[10px] font-bold text-[#7C3AED]">Syncing...</span>
              )}
            </div>

            {/* Circular Progress Meter */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="48"
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="48"
                    stroke="#7C3AED"
                    strokeWidth="10"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{progressPercent}%</span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {subtasks.length > 0
                      ? `${completedSubtasksCount}/${subtasks.length} steps`
                      : task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a checklist item..."
                className="h-9 flex-1 rounded-xl border border-slate-200 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center h-9 px-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Subtask List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {subtasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No subtasks yet. Break this task down into actionable steps above.
                </p>
              ) : (
                subtasks.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(idx)}
                      className="flex items-center gap-3 text-left flex-1 min-w-0"
                    >
                      <span
                        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                          item.completed
                            ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {item.completed && <Check className="h-3 w-3 stroke-[3]" />}
                      </span>
                      <span
                        className={`text-xs font-semibold truncate ${
                          item.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
