'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar as CalendarIcon, Hash, Plus, FolderGit2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useToast } from '../ui/toast';

const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z.string().max(1000).optional(),
  category: z.string().default('Others'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  projectId: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskModal() {
  const {
    isModalOpen,
    setIsModalOpen,
    selectedTask,
    draftDefaults,
    projects,
    tags: availableTags,
    fetchProjects,
    fetchTags,
    createTask,
    updateTask,
  } = useTaskStore();
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = React.useState('');

  const isEditing = Boolean(selectedTask && selectedTask._id);

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
      category: selectedTask?.category || draftDefaults?.category || 'Others',
      status: selectedTask?.status || draftDefaults?.status || 'TODO',
      priority: selectedTask?.priority || draftDefaults?.priority || 'MEDIUM',
      projectId: selectedTask?.projectId || draftDefaults?.projectId || '',
      dueDate: defaultDueDate,
    },
  });

  React.useEffect(() => {
    if (isModalOpen) {
      fetchProjects();
      fetchTags();
      reset({
        title: selectedTask?.title || '',
        description: selectedTask?.description || '',
        category: selectedTask?.category || draftDefaults?.category || 'Others',
        status: selectedTask?.status || draftDefaults?.status || 'TODO',
        priority: selectedTask?.priority || draftDefaults?.priority || 'MEDIUM',
        projectId: selectedTask?.projectId || draftDefaults?.projectId || '',
        dueDate: selectedTask?.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
          : new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      });
      setSelectedTags(selectedTask?.tags || draftDefaults?.tags || []);
      setCustomTagInput('');
    }
  }, [isModalOpen, selectedTask, draftDefaults, reset, fetchProjects, fetchTags]);

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const handleAddCustomTag = () => {
    const clean = customTagInput.trim().replace(/^#/, '');
    if (!clean) return;
    if (!selectedTags.includes(clean)) {
      setSelectedTags((prev) => [...prev, clean]);
    }
    setCustomTagInput('');
  };

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId ? data.projectId : null,
        tags: selectedTags,
        dueDate: data.dueDate,
      };

      if (isEditing && selectedTask?._id) {
        await updateTask(selectedTask._id, payload);
        toast.success('Task updated successfully');
      } else {
        await createTask(payload);
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
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-7 shadow-2xl border border-slate-100 transition-all animate-in fade-in-0 zoom-in-95">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="What needs to be done?"
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={2}
              {...register('description')}
              placeholder="Add acceptance criteria, notes, or context (optional)"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <select
                {...register('category')}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 font-medium focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
              >
                <option value="Others">Others</option>
                <option value="Design">Design</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="DevOps">DevOps</option>
                <option value="Development">Development</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
              <select
                {...register('priority')}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 font-medium focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
              >
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="HIGH">High (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Project & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-slate-400" /> Project
              </label>
              <select
                {...register('projectId')}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 font-medium focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Due Date</label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  {...register('dueDate')}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3.5 pr-9 text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                />
                <CalendarIcon className="absolute right-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.dueDate && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* Tags Multi-Select */}
          <div>
            <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
              <Hash className="h-3.5 w-3.5 text-slate-400" /> Tags
            </label>

            {/* Selected Tag Chips */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedTags.map((tagName) => {
                  const found = availableTags.find((t) => t.name === tagName);
                  return (
                    <span
                      key={tagName}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
                      style={{ backgroundColor: found?.color || '#7C3AED' }}
                    >
                      #{tagName}
                      <button
                        type="button"
                        onClick={() => toggleTag(tagName)}
                        className="hover:opacity-75"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Quick Pick Workspace Tags */}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {availableTags
                  .filter((t) => !selectedTags.includes(t.name))
                  .slice(0, 8)
                  .map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => toggleTag(t.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-[#7C3AED] transition-colors"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      #{t.name}
                    </button>
                  ))}
              </div>
            )}

            {/* Inline Custom Tag Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="Type a tag name and press Enter..."
                className="h-9 flex-1 rounded-xl border border-slate-200 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Status selector when editing */}
          {isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
              <select
                {...register('status')}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 font-medium focus:border-[#7C3AED] focus:outline-none cursor-pointer"
              >
                <option value="TODO">Pending (To Do)</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
