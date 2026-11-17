'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useToast } from '../ui/toast';
import { TaskStatus, TaskPriority } from '../../types';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z.string().max(1000).optional(),
  category: z.string().default('Others'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().min(1, 'Due date is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskModal() {
  const { isModalOpen, setIsModalOpen, selectedTask, createTask, updateTask } =
    useTaskStore();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditing = Boolean(selectedTask && selectedTask._id);

  // Format default due date as YYYY-MM-DD
  const defaultDueDate = selectedTask?.dueDate
    ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
    : new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: selectedTask?.title || '',
      description: selectedTask?.description || '',
      category: selectedTask?.category || 'Others',
      status: selectedTask?.status || 'TODO',
      priority: selectedTask?.priority || 'MEDIUM',
      dueDate: defaultDueDate,
    },
  });

  React.useEffect(() => {
    if (isModalOpen) {
      reset({
        title: selectedTask?.title || '',
        description: selectedTask?.description || '',
        category: selectedTask?.category || 'Others',
        status: selectedTask?.status || 'TODO',
        priority: selectedTask?.priority || 'MEDIUM',
        dueDate: selectedTask?.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
          : new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      });
    }
  }, [isModalOpen, selectedTask, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedTask?._id) {
        await updateTask(selectedTask._id, data);
        toast.success('Task updated successfully');
      } else {
        await createTask({
          title: data.title,
          description: data.description,
          category: data.category,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate,
        });
        toast.success('Task created successfully');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Action failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsModalOpen(false)}
      />

      {/* Modal Dialog Card matching Image 5 */}
      <div className="relative z-50 w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl border border-slate-100 transition-all transform animate-in fade-in-0 zoom-in-95">
        {/* Header with Title & Square Close Button matching Image 5 */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors shadow-2xs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body matching Image 5 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Task Title * with placeholder "What needs to be done?" */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="What needs to be done?"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Side-by-side Dropdowns matching Image 5 (Category & Priority) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                {...register('category')}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 font-medium focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.8rem_center] bg-no-repeat pr-9 cursor-pointer"
              >
                <option value="Others">Others</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Priority
              </label>
              <select
                {...register('priority')}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 font-medium focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.8rem_center] bg-no-repeat pr-9 cursor-pointer"
              >
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="HIGH">High (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Due Date matching Image 5 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Due Date
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                {...register('dueDate')}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
              />
              <CalendarIcon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Status selector (Shown when editing or optional) */}
          {isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                {...register('status')}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 font-medium focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.8rem_center] bg-no-repeat pr-9 cursor-pointer"
              >
                <option value="TODO">To Do (Pending)</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Add relevant notes or specifications..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>

          {/* Footer Action Buttons matching Image 5 */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="h-11 px-6 rounded-2xl bg-[#E2E8F0]/70 text-slate-700 hover:bg-[#E2E8F0] font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-7 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
