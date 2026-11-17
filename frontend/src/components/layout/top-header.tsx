'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Menu,
  ChevronRight,
  Settings as SettingsIcon,
  LogOut,
  Calendar,
  AlertTriangle,
  Clock,
  Plus,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { dashboardService } from '../../services/dashboard.service';
import { Task } from '../../types';
import { formatDate } from '../../lib/utils';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export function TopHeader({ onOpenMobileMenu }: TopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { viewMode, setFilters, setSelectedTask, setIsModalOpen } = useTaskStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [upcomingTasks, setUpcomingTasks] = React.useState<Task[]>([]);
  const [searchInput, setSearchInput] = React.useState('');

  // Fetch real notifications / upcoming tasks
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const tasks = await dashboardService.getUpcomingTasks(5);
        setUpcomingTasks(tasks);
      } catch {
        // quiet fallback
      }
    };
    fetchNotifications();
  }, []);

  // Handle global search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setFilters({ search: searchInput.trim(), page: 1 });
      router.push('/tasks');
    }
  };

  // Determine dynamic breadcrumbs
  const getBreadcrumb = () => {
    if (pathname === '/dashboard') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 font-bold">Dashboard Overview</span>
        </div>
      );
    }
    if (pathname.startsWith('/tasks')) {
      const modeLabel =
        viewMode === 'kanban'
          ? 'Kanban Board'
          : viewMode === 'calendar'
          ? 'Calendar View'
          : 'Table View';
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span>My Tasks</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 font-bold">{modeLabel}</span>
        </div>
      );
    }
    if (pathname.startsWith('/settings')) {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-900 font-bold">Settings & Profile</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <span>Workspace</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-900 font-bold">TaskFlow</span>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-8">
      {/* Left: Mobile Drawer Trigger & Dynamic Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-50"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">{getBreadcrumb()}</div>
      </div>

      {/* Right Controls: Global Search, Quick Add, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks... (Enter)"
            className="h-9 w-52 xl:w-64 pl-9 pr-3 rounded-full border border-slate-200/80 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 transition-all"
          />
        </form>

        {/* Quick Add Task Button */}
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          New Task
        </button>

        {/* Real Notification Bell with Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsUserMenuOpen(false);
            }}
            title="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Bell className="h-4 w-4" />
            {upcomingTasks.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 ring-2 ring-white"></span>
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 z-50 animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Upcoming Deadlines</h4>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#7C3AED]">
                    {upcomingTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="py-2 space-y-1.5 max-h-64 overflow-y-auto">
                {upcomingTasks.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No upcoming deadlines in the next 7 days.
                  </div>
                ) : (
                  upcomingTasks.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        setSelectedTask(t);
                        setIsModalOpen(true);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {t.title}
                        </p>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            t.priority === 'HIGH'
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Due {formatDate(t.dueDate)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <Link
                  href="/tasks"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-[11px] font-bold text-[#7C3AED] hover:underline"
                >
                  View All Tasks →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] rounded-full"
          >
            <div className="h-9 w-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs ring-2 ring-purple-100 shadow-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'TF'}
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in-0 zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Workspace User'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Dashboard Overview
                </Link>
                <Link
                  href="/tasks"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  My Tasks
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Settings & Profile
                </Link>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
