'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useTaskStore } from '../../store/taskStore';
import { useToast } from '../ui/toast';
import { TaskStatus, TaskPriority } from '../../types';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z.string().max(1000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().min(1, 'Due date is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskModal() {
  const { isModalOpen, setIsModalOpen, selectedTask, createTask, updateTask } =
    useTaskStore();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isEditing = !!selectedTask;

  // Format default due date as YYYY-MM-DD for date input
  const defaultDueDate = selectedTask
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
      status: selectedTask?.status || 'TODO',
      priority: selectedTask?.priority || 'MEDIUM',
      dueDate: defaultDueDate,
    },
  });

  // Reset form whenever modal opens with new or cleared task
  React.useEffect(() => {
    if (isModalOpen) {
      reset({
        title: selectedTask?.title || '',
        description: selectedTask?.description || '',
        status: selectedTask?.status || 'TODO',
        priority: selectedTask?.priority || 'MEDIUM',
        dueDate: selectedTask
          ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
          : new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      });
    }
  }, [isModalOpen, selectedTask, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedTask) {
        await updateTask(selectedTask._id, data);
        toast.success('Task updated successfully');
      } else {
        await createTask(data);
        toast.success('Task created successfully');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Action failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={
        isEditing
          ? 'Update your task details and parameters.'
          : 'Define a new task deliverable and schedule.'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Task Title (Matching Image 5) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register('title')}
            placeholder="What needs to be done?"
            error={errors.title?.message}
          />
        </div>

        {/* Status and Priority Dropdowns (Matching Image 5) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status
            </label>
            <select
              {...register('status')}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              {...register('priority')}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Due Date (Matching Image 5) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Due Date <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Description
          </label>
          <Textarea
            {...register('description')}
            placeholder="Add relevant notes, links, or specifications..."
            rows={3}
            error={errors.description?.message}
          />
        </div>

        {/* Action Buttons (Matching Image 5) */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Save Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
