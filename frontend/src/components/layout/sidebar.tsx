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
  const { logout } = useAuthStore();
  const { viewMode, setViewMode, openCreateModal, projects, tags, fetchProjects, fetchTags } =
    useTaskStore();

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
        <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
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
            className={`group flex w-full items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
              item.active
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-purple-900/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
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
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  item.active
                    ? 'bg-white/20 text-white'
                    : 'bg-white/[0.07] text-slate-400 group-hover:text-white'
                }`}
              >
                {item.badge}
              </span>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xl border border-white/10 z-50 whitespace-nowrap">
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
      className={`flex h-full flex-col justify-between bg-[#12121A] text-slate-300 transition-all duration-300 select-none border-r border-white/[0.06] ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Top Brand Bar */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-white/[0.06]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden"
            onClick={onMobileClose}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] text-white shadow-md shadow-purple-900/50">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                TaskFlow <span className="text-[#A78BFA] font-medium">Pro</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
            title={isCollapsed ? 'New Task' : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.08] hover:bg-[#7C3AED] text-white border border-white/10 hover:border-transparent py-2 text-xs font-bold transition-all ${
              isCollapsed ? 'px-0' : 'px-3'
            }`}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Quick New Task</span>}
          </button>
        </div>

        {/* Navigation Sections */}
        {renderSection('Workspace', workspaceLinks)}
        {renderSection('Management', managementLinks)}
        {renderSection('Account', accountLinks)}
      </div>

      {/* Footer Logout */}
      <div className="p-3 border-t border-white/[0.06] shrink-0">
        <button
          type="button"
          onClick={() => {
            if (onMobileClose) onMobileClose();
            logout();
          }}
          title={isCollapsed ? 'Sign Out' : undefined}
          className="group flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all relative"
        >
          <LogOut className="h-4 w-4 shrink-0 text-rose-400 group-hover:text-rose-300" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex shrink-0 min-h-screen sticky top-0 h-screen z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onMobileClose}
          />
          <div className="relative z-50 flex h-full max-w-xs w-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
