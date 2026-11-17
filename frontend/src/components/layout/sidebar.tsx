'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  PlusCircle,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle2,
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
  const { setViewMode, setIsModalOpen, setSelectedTask, setFilters } = useTaskStore();

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleNavClick = (href: string, view?: 'table' | 'kanban' | 'calendar') => {
    if (view) {
      setViewMode(view);
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

  const handleCategoryFilter = (category: string) => {
    setFilters({ category, page: 1 });
    router.push('/tasks');
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
    },
    {
      name: 'My Tasks',
      href: '/tasks',
      icon: CheckSquare,
      active: pathname === '/tasks',
      action: () => setViewMode('table'),
    },
    {
      name: 'Kanban Board',
      href: '/tasks',
      icon: FolderKanban,
      active: pathname === '/tasks',
      action: () => setViewMode('kanban'),
    },
    {
      name: 'Calendar',
      href: '/tasks',
      icon: Calendar,
      active: pathname === '/tasks',
      action: () => setViewMode('calendar'),
    },
  ];

  const projectCategories = [
    { name: 'Product Management', color: 'bg-cyan-400' },
    { name: 'Development', color: 'bg-purple-500' },
    { name: 'Design & UI/UX', color: 'bg-amber-400' },
    { name: 'Marketing & Ops', color: 'bg-rose-400' },
  ];

  const sidebarContent = (
    <div
      className={`flex h-full flex-col justify-between bg-[#14141E] text-slate-300 transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 overflow-hidden"
            onClick={onMobileClose}
          >
            {/* Geometric diamond logo matching Image 3 */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED] text-white shadow-lg shadow-purple-900/50">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Task<span className="text-[#A78BFA]">Flow</span>
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Enterprise
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Quick Create Task Trigger Button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={handleCreateTask}
            title="Create New Task"
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs py-2.5 transition-all shadow-md shadow-purple-900/40 active:scale-95 ${
              isCollapsed ? 'px-0' : 'px-4'
            }`}
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>New Task</span>}
          </button>
        </div>

        {/* Section: WORKSPACE */}
        <div className="px-3 py-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Workspace
            </div>
          )}

          {workspaceLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (item.action) item.action();
                  if (onMobileClose) onMobileClose();
                }}
                title={isCollapsed ? item.name : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                  item.active
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    item.active
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xl border border-white/10 z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Section: PROJECTS / CATEGORIES */}
        {!isCollapsed && (
          <div className="px-3 py-3 space-y-1">
            <div className="flex items-center justify-between px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              <span>Projects</span>
              <Layers className="h-3 w-3 text-slate-400" />
            </div>

            {projectCategories.map((proj) => (
              <button
                key={proj.name}
                onClick={() => handleCategoryFilter(proj.name)}
                className="group flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"
              >
                <span className={`h-2 w-2 rounded-full ${proj.color} shrink-0`} />
                <span className="truncate">{proj.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Preferences & User Section */}
      <div className="p-3 border-t border-white/5 space-y-1">
        {!isCollapsed && (
          <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Preferences
          </div>
        )}

        <Link
          href="/settings"
          onClick={onMobileClose}
          title={isCollapsed ? 'Settings' : undefined}
          className="group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all relative"
        >
          <Settings className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
          {!isCollapsed && <span>Settings</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold shadow-xl border border-white/10 z-50 whitespace-nowrap">
              Settings
            </div>
          )}
        </Link>

        {/* Logout button */}
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
          {isCollapsed && (
            <div className="absolute left-full ml-3 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-rose-400 text-[11px] font-bold shadow-xl border border-white/10 z-50 whitespace-nowrap">
              Sign Out
            </div>
          )}
        </button>

        {/* User Profile Mini Card */}
        {!isCollapsed && (
          <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 border border-white/5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] font-bold text-xs text-white uppercase">
              {user?.name ? user.name.slice(0, 2) : 'TF'}
            </div>
            <div className="overflow-hidden leading-tight">
              <p className="text-xs font-bold text-white truncate">
                {user?.name || 'Workspace User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex shrink-0 min-h-screen sticky top-0 z-30 shadow-2xl">
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
