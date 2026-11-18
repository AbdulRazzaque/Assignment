'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderGit2,
  CalendarClock,
  ArrowUpRight,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { differenceInCalendarDays, format } from 'date-fns';
import { Project, Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';

interface WorkspacePulseCardProps {
  projects: Project[];
  upcomingTasks: Task[];
}

export function WorkspacePulseCard({
  projects,
  upcomingTasks,
}: WorkspacePulseCardProps) {
  const router = useRouter();
  const { setFilters, setViewMode } = useTaskStore();

  const handleOpenProject = (projectId: string) => {
    setViewMode('table');
    setFilters({ projectId, page: 1 });
    router.push('/tasks');
  };

  return (
    <div className="space-y-6">
      {/* Active Projects Pulse */}
      <div className="card-premium p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
              <FolderGit2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Active Projects</h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Live milestone progress
              </p>
            </div>
          </div>
          <Link
            href="/projects"
            className="text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-0.5"
          >
            All <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl bg-slate-50 border border-dashed border-slate-200 p-4 text-center">
            <p className="text-xs font-semibold text-slate-500">No projects yet</p>
            <Link
              href="/projects"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] hover:underline"
            >
              <Plus className="h-3 w-3" /> Create your first project
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 3).map((proj) => (
              <button
                key={proj._id}
                type="button"
                onClick={() => handleOpenProject(proj._id)}
                className="w-full text-left p-3 rounded-xl bg-slate-50/80 hover:bg-purple-50/50 border border-slate-100 hover:border-purple-200 transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-800 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color }}
                    />
                    <span className="truncate">{proj.name}</span>
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-700 tabular-nums">
                    {proj.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200/70 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%`, backgroundColor: proj.color }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                  <span>
                    {proj.completedTasks}/{proj.totalTasks} tasks done
                  </span>
                  <span>{proj.status.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Deadlines Radar */}
      <div className="card-premium p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <CalendarClock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Deadline Radar</h3>
              <p className="text-[11px] text-slate-400 font-medium">Next due deliverables</p>
            </div>
          </div>
          <Link
            href="/tasks"
            className="text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-0.5"
          >
            Schedule <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-4 text-center flex flex-col items-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-1" />
            <p className="text-xs font-bold text-emerald-800">Schedule Clear</p>
            <p className="text-[11px] text-emerald-600/80">No imminent deadlines pending</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcomingTasks.slice(0, 4).map((t) => {
              const daysLeft = differenceInCalendarDays(new Date(t.dueDate), new Date());
              const urgencyBadge =
                daysLeft <= 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : daysLeft <= 2
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200';

              const urgencyText =
                daysLeft < 0
                  ? `${Math.abs(daysLeft)}d late`
                  : daysLeft === 0
                  ? 'Due today'
                  : daysLeft === 1
                  ? 'Tomorrow'
                  : `In ${daysLeft}d`;

              return (
                <Link
                  key={t._id}
                  href={`/tasks/${t._id}`}
                  className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{t.title}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {format(new Date(t.dueDate), 'MMM d, yyyy')} · {t.category || 'General'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold border ${urgencyBadge}`}
                  >
                    {urgencyText}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
