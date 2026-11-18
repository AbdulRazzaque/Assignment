'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderGit2,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Edit2,
  Trash2,
  ArrowUpRight,
  X,
  Layers,
  PauseCircle,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { Project, ProjectStatus } from '../../../types';
import { projectService } from '../../../services/workspace.service';
import { useTaskStore } from '../../../store/taskStore';
import { useToast } from '../../../components/ui/toast';
import { Skeleton } from '../../../components/ui/skeleton';

const PROJECT_COLORS = [
  '#7C3AED',
  '#2563EB',
  '#059669',
  '#D97706',
  '#DC2626',
  '#DB2777',
  '#0891B2',
  '#4F46E5',
];

export default function ProjectsPage() {
  const router = useRouter();
  const toast = useToast();
  const { setFilters, setViewMode, openCreateModal, fetchProjects: syncStoreProjects } =
    useTaskStore();

  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<ProjectStatus | 'ALL'>('ALL');

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  // Modal Form state
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [color, setColor] = React.useState('#7C3AED');
  const [status, setStatus] = React.useState<ProjectStatus>('ACTIVE');
  const [dueDate, setDueDate] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const loadProjects = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const openNewProjectModal = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setColor('#7C3AED');
    setStatus('ACTIVE');
    setDueDate('');
    setIsModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || '');
    setColor(project.color || '#7C3AED');
    setStatus(project.status);
    setDueDate(
      project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''
    );
    setActiveMenuId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject._id, {
          name: name.trim(),
          description: description.trim(),
          color,
          status,
          dueDate: dueDate || null,
        });
        toast.success('Project updated successfully');
      } else {
        await projectService.createProject({
          name: name.trim(),
          description: description.trim(),
          color,
          status,
          dueDate: dueDate || null,
        });
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      await Promise.all([loadProjects(), syncStoreProjects()]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    setActiveMenuId(null);
    if (
      !confirm(
        `Delete project "${project.name}"? Tasks inside this project will remain safely in My Tasks.`
      )
    ) {
      return;
    }

    try {
      await projectService.deleteProject(project._id);
      toast.success('Project deleted');
      await Promise.all([loadProjects(), syncStoreProjects()]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  const handleViewProjectTasks = (projectId: string) => {
    setViewMode('table');
    setFilters({
      projectId,
      category: undefined,
      tag: undefined,
      status: undefined,
      priority: undefined,
      page: 1,
    });
    router.push('/tasks');
  };

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;
  const totalLinkedTasks = projects.reduce((sum, p) => sum + p.totalTasks, 0);
  const avgProgress =
    projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Organize cross-functional initiatives and track real-time delivery progress.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewProjectModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Projects</span>
            <span className="h-8 w-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{projects.length}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Sprints</span>
            <span className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{activeCount}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed</span>
            <span className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{completedCount}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Completion</span>
            <span className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl font-extrabold text-slate-900">{avgProgress}%</p>
            <span className="text-[11px] font-semibold text-slate-400">
              across {totalLinkedTasks} tasks
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter projects by name or description..."
            className="h-9 w-full pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/70">
          {(['ALL', 'ACTIVE', 'ON_HOLD', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white text-[#7C3AED] shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st === 'ALL'
                ? 'All'
                : st === 'ACTIVE'
                ? 'Active'
                : st === 'ON_HOLD'
                ? 'On Hold'
                : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-4">
            <FolderGit2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {projects.length === 0 ? 'Create your first Project' : 'No matching projects'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Group related tasks under dedicated projects to track completion velocity, milestones,
            and deliverables in one place.
          </p>
          <button
            type="button"
            onClick={openNewProjectModal}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const statusPill =
              project.status === 'COMPLETED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : project.status === 'ON_HOLD'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';

            return (
              <div
                key={project._id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all overflow-hidden"
              >
                {/* Top Color Accent Bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: project.color }} />

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-extrabold text-sm shadow-sm"
                        style={{ backgroundColor: project.color }}
                      >
                        {project.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-900 truncate">
                          {project.name}
                        </h3>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusPill}`}
                        >
                          {project.status === 'ON_HOLD' && <PauseCircle className="h-2.5 w-2.5" />}
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Actions dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === project._id ? null : project._id)
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {activeMenuId === project._id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-xl bg-white p-1.5 shadow-xl border border-slate-100 z-20">
                          <button
                            type="button"
                            onClick={() => openEditProjectModal(project)}
                            className="flex w-full items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit Project
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              openCreateModal({ projectId: project._id });
                            }}
                            className="flex w-full items-center gap-2 px-2.5 py-2 text-xs font-semibold text-[#7C3AED] hover:bg-purple-50 rounded-lg"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Task Here
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(project)}
                            className="flex w-full items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                    {project.description || 'No description provided for this project.'}
                  </p>

                  {/* Live MongoDB Progress Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">
                        {project.completedTasks}/{project.totalTasks} tasks completed
                      </span>
                      <span className="text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {project.dueDate
                        ? `Due ${format(new Date(project.dueDate), 'MMM d, yyyy')}`
                        : 'No deadline'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openCreateModal({ projectId: project._id })}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
                    >
                      + Task
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewProjectTasks(project._id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#7C3AED]/10 text-[11px] font-bold text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-colors"
                    >
                      Tasks <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-50 w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Q4 Mobile Redesign"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope, key milestones, and goals..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 focus:border-[#7C3AED] focus:outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 focus:border-[#7C3AED] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Project Color Accent
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {PROJECT_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setColor(hex)}
                      className={`h-7 w-7 rounded-full transition-transform ${
                        color === hex ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-bold text-white shadow-md shadow-purple-500/25 disabled:opacity-60"
                >
                  {isSaving
                    ? 'Saving...'
                    : editingProject
                    ? 'Save Changes'
                    : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
