'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  BarChart3,
  Users,
  Tags,
  FolderTree,
  FolderGit2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: number;
  action: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const {
    tasks,
    viewMode,
    setViewMode,
    openCreateModal,
    projects,
    tags,
    fetchProjects,
    fetchTags,
  } = useTaskStore();

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    fetchProjects();
    fetchTags();
  }, [fetchProjects, fetchTags]);

  const navigate = (href: string, view?: 'table' | 'kanban' | 'calendar') => {
    if (view) setViewMode(view);
    router.push(href);
    if (onMobileClose) onMobileClose();
  };

  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const completionPct =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const workspaceLinks: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
      action: () => navigate('/dashboard'),
    },
    {
      name: 'My Tasks',
      href: '/tasks',
      icon: CheckSquare,
      active: pathname === '/tasks' && viewMode === 'table',
      action: () => navigate('/tasks', 'table'),
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: FolderGit2,
      active: pathname === '/projects',
      badge: projects.length > 0 ? projects.length : undefined,
      action: () => navigate('/projects'),
    },
    {
      name: 'Kanban Board',
      href: '/tasks',
      icon: FolderKanban,
      active: pathname === '/tasks' && viewMode === 'kanban',
      action: () => navigate('/tasks', 'kanban'),
    },
    {
      name: 'Calendar',
      href: '/tasks',
      icon: Calendar,
      active: pathname === '/tasks' && viewMode === 'calendar',
      action: () => navigate('/tasks', 'calendar'),
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      active: pathname === '/reports',
      action: () => navigate('/reports'),
    },
  ];

  const managementLinks: NavItem[] = [
    {
      name: 'Team',
      href: '/team',
      icon: Users,
      active: pathname === '/team',
      action: () => navigate('/team'),
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: FolderTree,
      active: pathname === '/categories',
      action: () => navigate('/categories'),
    },
    {
      name: 'Tags',
      href: '/tags',
      icon: Tags,
      active: pathname === '/tags',
      badge: tags.length > 0 ? tags.length : undefined,
      action: () => navigate('/tags'),
    },
  ];

  const accountLinks: NavItem[] = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
      action: () => navigate('/settings'),
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
      active: pathname === '/help',
      action: () => navigate('/help'),
    },
  ];

  const renderSection = (label: string, items: NavItem[]) => (
    <div className="px-3 py-2 space-y-0.5">
      {!isCollapsed && (
        <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </div>
      )}

      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            type="button"
            onClick={item.action}
            title={isCollapsed ? item.name : undefined}
            className={`group flex w-full items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative ${
              item.active
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-glow font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {/* Active Glowing Left Indicator */}
            {item.active && (
              <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-purple-400 shadow-[0_0_12px_#A855F7]" />
            )}

            <span className="flex items-center gap-3 min-w-0">
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  item.active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </span>

            {!isCollapsed && item.badge !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums ${
                  item.active
                    ? 'bg-white/20 text-white'
                    : 'bg-white/[0.08] text-slate-400 group-hover:text-white'
                }`}
              >
                {item.badge}
              </span>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1.5 rounded-lg bg-[#0F0F1C] text-white text-[11px] font-bold shadow-elevated border border-white/10 z-50 whitespace-nowrap">
                {item.name}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <div
      className={`relative flex h-full flex-col justify-between bg-[#0C0C14] text-slate-300 transition-all duration-300 select-none border-r border-white/[0.06] overflow-hidden ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Subtle Top Ambient Violet Glow */}
      <div
        className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full opacity-35 blur-3xl"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-white/[0.06]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden"
            onClick={onMobileClose}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#A855F7] text-white shadow-glow">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-extrabold tracking-tight text-white whitespace-nowrap font-display">
                  TaskFlow <span className="text-[#A78BFA]">Pro</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                  Enterprise SaaS
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400 hover:text-white hover:bg-white/15 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Quick Create CTA */}
        <div className="px-3 pt-4 pb-1">
          <button
            type="button"
            onClick={() => {
              openCreateModal();
              if (onMobileClose) onMobileClose();
            }}
            title={isCollapsed ? 'Quick New Task' : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED]/90 to-[#6D28D9]/90 hover:from-[#7C3AED] hover:to-[#5B21B6] text-white border border-purple-400/20 py-2.5 text-xs font-bold shadow-md shadow-purple-950/60 transition-all active:scale-[0.98] ${
              isCollapsed ? 'px-0' : 'px-3'
            }`}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>New Task</span>}
          </button>
        </div>

        {/* Navigation Sections */}
        {renderSection('Workspace', workspaceLinks)}
        {renderSection('Management', managementLinks)}
        {renderSection('Account', accountLinks)}
      </div>

      {/* Bottom Workspace Sprint Progress Card + Sign Out */}
      <div className="relative z-10 p-3 border-t border-white/[0.06] space-y-2.5 shrink-0">
        {!isCollapsed && (
          <Link
            href="/reports"
            onClick={onMobileClose}
            className="block rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] p-3 transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-purple-300">
                <Sparkles className="h-3 w-3" /> Sprint Velocity
              </span>
              <span className="text-white tabular-nums">{completionPct}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400 truncate">
              {completedTasks} of {tasks.length} tasks completed · {user?.role || 'Admin'}
            </p>
          </Link>
        )}

        <button
          type="button"
          onClick={() => {
            if (onMobileClose) onMobileClose();
            logout();
          }}
          title={isCollapsed ? 'Sign Out' : undefined}
          className="group flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex shrink-0 sticky top-0 h-screen z-30 shadow-2xl">
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onMobileClose}
          />
          <div className="relative z-50 flex h-full max-w-xs w-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
