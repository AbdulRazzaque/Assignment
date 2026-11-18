'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderTree,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Palette,
  Server,
  Layout,
  Terminal,
  Briefcase,
  User as UserIcon,
  Layers,
} from 'lucide-react';
import { taskService } from '../../../services/task.service';
import { Task } from '../../../types';
import { useTaskStore } from '../../../store/taskStore';
import { Skeleton } from '../../../components/ui/skeleton';

const DEFAULT_CATEGORIES = [
  { name: 'Design', color: '#7C3AED', bg: 'bg-purple-50 text-purple-700', icon: Palette, desc: 'UI/UX design systems, wireframes, and branding' },
  { name: 'Backend', color: '#2563EB', bg: 'bg-blue-50 text-blue-700', icon: Server, desc: 'REST APIs, databases, authentication, and services' },
  { name: 'Frontend', color: '#EA580C', bg: 'bg-orange-50 text-orange-700', icon: Layout, desc: 'Next.js interfaces, components, and state management' },
  { name: 'DevOps', color: '#059669', bg: 'bg-emerald-50 text-emerald-700', icon: Terminal, desc: 'CI/CD pipelines, cloud deployments, and monitoring' },
  { name: 'Development', color: '#4F46E5', bg: 'bg-indigo-50 text-indigo-700', icon: Layers, desc: 'Full-stack engineering and feature delivery' },
  { name: 'Work', color: '#0891B2', bg: 'bg-cyan-50 text-cyan-700', icon: Briefcase, desc: 'Operations, sprint planning, and reviews' },
  { name: 'Personal', color: '#DB2777', bg: 'bg-pink-50 text-pink-700', icon: UserIcon, desc: 'Personal productivity and skill goals' },
  { name: 'Others', color: '#475569', bg: 'bg-slate-100 text-slate-700', icon: FolderTree, desc: 'Uncategorized or cross-functional items' },
];

export default function CategoriesPage() {
  const router = useRouter();
  const { setFilters, setViewMode, openCreateModal } = useTaskStore();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await taskService.getTasks({ limit: 100, page: 1 });
        setTasks(res.tasks);
      } catch {
        // silent
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const categoryCards = React.useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        color: string;
        bg: string;
        desc: string;
        icon: React.ComponentType<{ className?: string }>;
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
      }
    >();

    for (const def of DEFAULT_CATEGORIES) {
      map.set(def.name.toLowerCase(), {
        ...def,
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
      });
    }

    for (const t of tasks) {
      const catName = (t.category || 'Others').trim();
      const key = catName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: catName,
          color: '#7C3AED',
          bg: 'bg-purple-50 text-purple-700',
          desc: 'Custom workspace category',
          icon: FolderTree,
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
        });
      }
      const item = map.get(key)!;
      item.total += 1;
      if (t.status === 'COMPLETED') item.completed += 1;
      else if (t.status === 'IN_PROGRESS') item.inProgress += 1;
      else item.pending += 1;
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [tasks]);

  const handleOpenCategory = (categoryName: string) => {
    setViewMode('table');
    setFilters({
      category: categoryName,
      projectId: undefined,
      tag: undefined,
      page: 1,
    });
    router.push('/tasks');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Categories
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Functional workstreams with real-time completion progress across all your tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
            return (
              <div
                key={cat.name}
                className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${cat.bg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-extrabold text-slate-700">
                      {cat.total} task{cat.total === 1 ? '' : 's'}
                    </span>
                  </div>

                  <h3 className="mt-3.5 text-sm font-extrabold text-slate-900">{cat.name}</h3>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 min-h-[32px]">
                    {cat.desc}
                  </p>

                  {/* Progress */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {cat.completed} done
                      </span>
                      <span className="text-slate-900">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {cat.inProgress} active
                      </span>
                      <span>{cat.pending} pending</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openCreateModal({ category: cat.name })}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
                  >
                    + Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenCategory(cat.name)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] hover:underline"
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
