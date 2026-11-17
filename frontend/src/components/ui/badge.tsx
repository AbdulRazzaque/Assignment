import * as React from 'react';
import { cn } from '../../lib/utils';
import { TaskPriority, TaskStatus } from '../../types';
import { AlertCircle } from 'lucide-react';

export function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, { bg: string; text: string; dot: string; label: string }> = {
    TODO: {
      bg: 'bg-amber-50 border-amber-200/60',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      label: 'To Do',
    },
    IN_PROGRESS: {
      bg: 'bg-purple-50 border-purple-200/60',
      text: 'text-purple-700',
      dot: 'bg-purple-500',
      label: 'In Progress',
    },
    COMPLETED: {
      bg: 'bg-emerald-50 border-emerald-200/60',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      label: 'Completed',
    },
  };

  const current = styles[status] || styles.TODO;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-xs transition-colors',
        current.bg,
        current.text
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', current.dot)} />
      {current.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, { bg: string; text: string; label: string; iconColor: string }> = {
    LOW: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      text: 'text-slate-600',
      label: 'Low',
      iconColor: 'text-slate-400',
    },
    MEDIUM: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      text: 'text-blue-700',
      label: 'Medium',
      iconColor: 'text-blue-500',
    },
    HIGH: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      text: 'text-rose-700',
      label: 'High',
      iconColor: 'text-rose-500',
    },
  };

  const current = styles[priority] || styles.MEDIUM;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border',
        current.bg
      )}
    >
      <svg
        className={cn('h-3 w-3', current.iconColor)}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
          clipRule="evenodd"
        />
      </svg>
      {current.label}
    </span>
  );
}

export function OverdueBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-100 text-rose-700 border border-rose-200">
      <AlertCircle className="h-3 w-3 text-rose-600" />
      Overdue
    </span>
  );
}
