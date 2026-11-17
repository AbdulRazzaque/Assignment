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
  Edit2,
  Trash2,
  CheckCircle2,
  MoreHorizontal,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Activity as ActivityIcon,
  ArrowLeft,
} from 'lucide-react';
import { taskService } from '../../../../services/task.service';
import { Task } from '../../../../types';
import { useTaskStore } from '../../../../store/taskStore';
import { useAuthStore } from '../../../../store/authStore';
import { Skeleton } from '../../../../components/ui/skeleton';
import { format } from 'date-fns';

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { setSelectedTask, setIsModalOpen, setIsDeleteModalOpen, updateStatus } = useTaskStore();
  const { user } = useAuthStore();

  const taskId = params?.id as string;
  const [task, setTask] = React.useState<Task | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'subtasks' | 'activity' | 'comments' | 'attachments'>('overview');

  // Interactive Checklist state
  const [subtasks, setSubtasks] = React.useState([
    { id: 1, text: 'Design wireframes', done: true },
    { id: 2, text: 'Design UI in Figma', done: true },
    { id: 3, text: 'Implement responsive layout', done: true },
    { id: 4, text: 'Final review and updates', done: false },
  ]);

  const loadTask = React.useCallback(async () => {
    if (!taskId) return;
    setIsLoading(true);
    try {
      const data = await taskService.getTaskById(taskId);
      setTask(data);
    } catch {
      router.push('/tasks');
    } finally {
      setIsLoading(false);
    }
  }, [taskId, router]);

  React.useEffect(() => {
    loadTask();
  }, [loadTask]);

  const toggleSubtask = (id: number) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const completedSubtasksCount = subtasks.filter((s) => s.done).length;
  const progressPercent = Math.round((completedSubtasksCount / subtasks.length) * 100);

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

  // Format dates
  let formattedCreated = 'Nov 10, 2026, 10:24 AM';
  let formattedUpdated = 'Nov 17, 2026, 02:30 PM';
  let formattedDue = 'Nov 20, 2026';
  try {
    formattedCreated = format(new Date(task.createdAt), 'MMM d, yyyy, hh:mm a');
    formattedUpdated = format(new Date(task.updatedAt), 'MMM d, yyyy, hh:mm a');
    formattedDue = format(new Date(task.dueDate), 'MMM d, yyyy');
  } catch {
    // ignore
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb matching Screen 8 */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/tasks" className="hover:text-slate-900 transition-colors">
          My Tasks
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-800 font-bold">Task Details</span>
      </div>

      {/* Header Container matching Screen 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {task.title}
          </h1>

          {/* Meta Pills Row matching Screen 8 */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-500'
                    : task.status === 'IN_PROGRESS'
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
              />
              {task.status === 'COMPLETED'
                ? 'Completed'
                : task.status === 'IN_PROGRESS'
                ? 'In Progress'
                : 'Pending'}
            </span>

            {/* Priority Pill */}
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
              <span>{task.priority === 'HIGH' ? 'High' : task.priority === 'MEDIUM' ? 'Medium' : 'Low'}</span>
            </span>

            {/* Due Date Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/80">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Due: {formattedDue}</span>
            </span>
          </div>
        </div>

        {/* Right Action Buttons matching Screen 8 */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
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

      {/* Tabs Navigation matching Screen 8 */}
      <div className="flex items-center gap-8 border-b border-slate-200 px-2 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'overview' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Overview
          {activeTab === 'overview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('subtasks')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'subtasks' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Subtasks ({completedSubtasksCount}/{subtasks.length})
          {activeTab === 'subtasks' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'activity' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Activity
          {activeTab === 'activity' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'comments' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Comments (5)
          {activeTab === 'comments' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('attachments')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'attachments' ? 'text-[#7C3AED]' : 'hover:text-slate-800'
          }`}
        >
          Attachments (2)
          {activeTab === 'attachments' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
      </div>

      {/* Main Tab Content matching Screen 8 (60% Description / 40% Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Description & Task Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Description Card */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {task.description ||
                'Create a modern, responsive and user-friendly dashboard with task statistics, charts and quick actions.'}
            </p>
          </div>

          {/* Task Information 2x2 Grid matching Screen 8 */}
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Task Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Created by */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Created by</span>
                  <span className="font-extrabold text-slate-800">{user?.name || 'Abdul Razzaque'}</span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Last Updated</span>
                  <span className="font-extrabold text-slate-800">{formattedUpdated}</span>
                </div>
              </div>

              {/* Created on */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Created on</span>
                  <span className="font-extrabold text-slate-800">{formattedCreated}</span>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <FolderTree className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Category</span>
                  <span className="font-extrabold text-slate-800">{task.category || 'Design'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Progress & Interactive Checklist matching Screen 8 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-100 space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Progress
            </h3>

            {/* Circular Progress Meter matching Screen 8: 75% */}
            <div className="flex flex-col items-center justify-center py-2">
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
                  <span className="text-2xl font-black text-slate-900">
                    {progressPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist matching Screen 8 */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              {subtasks.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleSubtask(item.id)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
                >
                  <div
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition-colors ${
                      item.done
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.done && <CheckSquare className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      item.done ? 'text-slate-500 line-through' : 'text-slate-800'
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
