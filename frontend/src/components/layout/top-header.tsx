'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  Settings as SettingsIcon,
  LogOut,
  Clock,
  Plus,
  X,
  User as UserIcon,
  CheckCircle2,
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
  const { setFilters, setSelectedTask, setIsModalOpen } = useTaskStore();

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

  // Keyboard shortcut ⌘K or Ctrl+K focus search
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle global search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setFilters({ search: searchInput.trim(), page: 1 });
      router.push('/tasks');
    }
  };

  const displayName = user?.name || 'Abdul Razzaque';
  const displayRole = user?.role || 'Administrator';

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Hamburger & Global Search matching Screen 4 */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar with ⌘ K shortcut */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks, projects, or members... ⌘ K"
            className="h-10 w-full pl-10 pr-12 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs pointer-events-none">
            ⌘ K
          </kbd>
        </form>
      </div>

      {/* Right Controls: Notification Bell, User Avatar & Dropdown */}
      <div className="flex items-center gap-4">
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

        {/* User Profile matching Screen 4: Avatar + Abdul Razzaque + Administrator v */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
          >
            <div className="h-9 w-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs ring-2 ring-purple-100 shadow-xs overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span>{displayName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900 truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                {displayRole} <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in-0 zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="mt-1 inline-block text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  {displayRole}
                </span>
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
