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
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { viewMode, setViewMode, setIsModalOpen, setSelectedTask, setFilters } = useTaskStore();

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleNavClick = (href: string, view?: 'table' | 'kanban' | 'calendar') => {
    if (view) {
      setViewMode(view);
    }
    if (pathname !== href) {
      router.push(href);
    }
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const workspaceLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
      action: () => router.push('/dashboard'),
    },
    {
      name: 'My Tasks',
      href: '/tasks',
      icon: CheckSquare,
      active: pathname === '/tasks' && viewMode === 'table',
      action: () => {
        setViewMode('table');
        router.push('/tasks');
      },
    },
    {
      name: 'Projects',
      href: '/tasks',
      icon: FolderTree,
      active: false,
      action: () => {
        setFilters({ category: undefined, page: 1 });
        router.push('/tasks');
      },
    },
    {
      name: 'Kanban Board',
      href: '/tasks',
      icon: FolderKanban,
      active: pathname === '/tasks' && viewMode === 'kanban',
      action: () => {
        setViewMode('kanban');
        router.push('/tasks');
      },
    },
    {
      name: 'Calendar',
      href: '/tasks',
      icon: Calendar,
      active: pathname === '/tasks' && viewMode === 'calendar',
      action: () => {
        setViewMode('calendar');
        router.push('/tasks');
      },
    },
    {
      name: 'Reports',
      href: '/dashboard',
      icon: BarChart3,
      active: false,
      action: () => router.push('/dashboard'),
    },
  ];

  const managementLinks = [
    {
      name: 'Team',
      icon: Users,
      action: () => router.push('/settings'),
    },
    {
      name: 'Categories',
      icon: FolderTree,
      action: () => {
        setFilters({ category: 'Design', page: 1 });
        router.push('/tasks');
      },
    },
    {
      name: 'Tags',
      icon: Tags,
      action: () => {
        setFilters({ priority: 'HIGH', page: 1 });
        router.push('/tasks');
      },
    },
  ];

  const accountLinks = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname === '/settings',
      action: () => router.push('/settings'),
    },
    {
      name: 'Help & Support',
      href: '/settings',
      icon: HelpCircle,
      active: false,
      action: () => router.push('/settings'),
    },
  ];

  const sidebarContent = (
    <div
      className={`flex h-full flex-col justify-between bg-[#12121A] text-slate-300 transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Top Branding matching Screen 4 */}
      <div className="overflow-y-auto overflow-x-hidden">
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden"
            onClick={onMobileClose}
          >
            {/* Violet geometric star icon matching Screen 4 */}
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

          {/* Collapse Toggle Button */}
          <button
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

        {/* Section: WORKSPACE */}
        <div className="px-3 pt-4 pb-2 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </div>
          )}

          {workspaceLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  if (onMobileClose) onMobileClose();
                }}
                title={isCollapsed ? item.name : undefined}
                className={`group flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                  item.active
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-900/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    item.active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xl border border-white/10 z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Section: MANAGEMENT */}
        <div className="px-3 py-2 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Management
            </div>
          )}

          {managementLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  if (onMobileClose) onMobileClose();
                }}
                title={isCollapsed ? item.name : undefined}
                className="group flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all relative"
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
                {!isCollapsed && <span>{item.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xl border border-white/10 z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Section: ACCOUNT */}
        <div className="px-3 py-2 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Account
            </div>
          )}

          {accountLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  if (onMobileClose) onMobileClose();
                }}
                title={isCollapsed ? item.name : undefined}
                className={`group flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                  item.active
                    ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-900/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    item.active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xl border border-white/10 z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button
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
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex shrink-0 min-h-screen sticky top-0 z-30 shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
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
