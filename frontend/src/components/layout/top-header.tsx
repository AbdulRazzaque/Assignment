'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Clock,
  Plus,
  X,
  LayoutDashboard,
  CheckSquare,
  FolderGit2,
  FolderKanban,
  Calendar,
  BarChart3,
  Users,
  FolderTree,
  Tags,
  Settings,
  HelpCircle,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { dashboardService } from '../../services/dashboard.service';
import { Task } from '../../types';
import { formatDate } from '../../lib/utils';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

interface CommandItem {
  id: string;
  group: 'Actions' | 'Navigation' | 'Tasks';
  label: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

export function TopHeader({ onOpenMobileMenu }: TopHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { tasks, setFilters, setSelectedTask, setIsModalOpen, setViewMode, openCreateModal } =
    useTaskStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [commandQuery, setCommandQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [upcomingTasks, setUpcomingTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const list = await dashboardService.getUpcomingTasks(5);
        setUpcomingTasks(list);
      } catch {
        // silent
      }
    };
    fetchNotifications();
  }, []);

  // Global ⌘K / Ctrl+K shortcut for Command Palette
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
        setIsNotifOpen(false);
        setIsUserMenuOpen(false);
      } else if (e.key === 'Escape') {
        setIsCommandOpen(false);
        setIsNotifOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commandItems = React.useMemo<CommandItem[]>(() => {
    const navAndActions: CommandItem[] = [
      {
        id: 'action-new-task',
        group: 'Actions',
        label: 'Create New Task',
        subtitle: 'Open task modal immediately',
        icon: Plus,
        onSelect: () => openCreateModal(),
      },
      {
        id: 'nav-dashboard',
        group: 'Navigation',
        label: 'Dashboard Overview',
        subtitle: 'KPIs, charts & recent review list',
        icon: LayoutDashboard,
        onSelect: () => router.push('/dashboard'),
      },
      {
        id: 'nav-tasks',
        group: 'Navigation',
        label: 'My Tasks (Table View)',
        subtitle: 'Filter, sort, bulk-edit & export tasks',
        icon: CheckSquare,
        onSelect: () => {
          setViewMode('table');
          router.push('/tasks');
        },
      },
      {
        id: 'nav-projects',
        group: 'Navigation',
        label: 'Projects Workspace',
        subtitle: 'Manage projects & completion progress',
        icon: FolderGit2,
        onSelect: () => router.push('/projects'),
      },
      {
        id: 'nav-kanban',
        group: 'Navigation',
        label: 'Kanban Board',
        subtitle: 'Drag-and-drop workflow columns',
        icon: FolderKanban,
        onSelect: () => {
          setViewMode('kanban');
          router.push('/tasks');
        },
      },
      {
        id: 'nav-calendar',
        group: 'Navigation',
        label: 'Calendar View',
        subtitle: 'Schedule & deadline timeline',
        icon: Calendar,
        onSelect: () => {
          setViewMode('calendar');
          router.push('/tasks');
        },
      },
      {
        id: 'nav-reports',
        group: 'Navigation',
        label: 'Reports & Analytics',
        subtitle: 'Velocity charts, breakdowns & exports',
        icon: BarChart3,
        onSelect: () => router.push('/reports'),
      },
      {
        id: 'nav-team',
        group: 'Navigation',
        label: 'Team Directory',
        subtitle: 'Workspace collaborators & roles',
        icon: Users,
        onSelect: () => router.push('/team'),
      },
      {
        id: 'nav-categories',
        group: 'Navigation',
        label: 'Categories',
        subtitle: 'Organize tasks by functional domain',
        icon: FolderTree,
        onSelect: () => router.push('/categories'),
      },
      {
        id: 'nav-tags',
        group: 'Navigation',
        label: 'Tags Studio',
        subtitle: 'Create & manage colored labels',
        icon: Tags,
        onSelect: () => router.push('/tags'),
      },
      {
        id: 'nav-settings',
        group: 'Navigation',
        label: 'Settings & Profile',
        subtitle: 'Account, preferences & security',
        icon: Settings,
        onSelect: () => router.push('/settings'),
      },
      {
        id: 'nav-help',
        group: 'Navigation',
        label: 'Help & Support Center',
        subtitle: 'System health, docs & support tickets',
        icon: HelpCircle,
        onSelect: () => router.push('/help'),
      },
    ];

    const taskItems: CommandItem[] = tasks.slice(0, 8).map((t) => ({
      id: `task-${t._id}`,
      group: 'Tasks',
      label: t.title,
      subtitle: `${t.category || 'General'} · ${t.priority} · Due ${formatDate(t.dueDate)}`,
      icon: CheckSquare,
      onSelect: () => router.push(`/tasks/${t._id}`),
    }));

    const all = [...navAndActions, ...taskItems];
    if (!commandQuery.trim()) return all;

    const q = commandQuery.trim().toLowerCase();
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.group.toLowerCase().includes(q)
    );
  }, [commandQuery, tasks, openCreateModal, router, setViewMode]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [commandQuery, isCommandOpen]);

  const handleCommandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (commandItems.length > 0 ? (prev + 1) % commandItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        commandItems.length > 0 ? (prev - 1 + commandItems.length) % commandItems.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (commandItems[activeIndex]) {
        commandItems[activeIndex].onSelect();
        setIsCommandOpen(false);
        setCommandQuery('');
      } else if (commandQuery.trim()) {
        setFilters({ search: commandQuery.trim(), page: 1 });
        router.push('/tasks');
        setIsCommandOpen(false);
        setCommandQuery('');
      }
    }
  };

  const displayName = user?.name || 'Abdul Razzaque';
  const displayRole = user?.role || 'Administrator';

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
        {/* Left: Mobile Hamburger & Command Palette Trigger */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-50 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="relative flex h-10 w-full max-w-sm sm:max-w-md items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 text-left text-xs text-slate-400 hover:bg-white hover:border-slate-300 transition-all group"
          >
            <span className="flex items-center gap-2.5 truncate">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-[#7C3AED] transition-colors shrink-0" />
              <span className="truncate">Search tasks, projects, tags, or commands...</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 shadow-2xs shrink-0">
              ⌘ K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Notifications & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick New Task button on desktop */}
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm shadow-purple-500/20 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsUserMenuOpen(false);
              }}
              title="Upcoming Deadlines"
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
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="py-2 space-y-1.5 max-h-64 overflow-y-auto">
                  {upcomingTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      You&apos;re all caught up! No upcoming deadlines.
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
                          <p className="text-xs font-bold text-slate-800 truncate">{t.title}</p>
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

          {/* Profile Menu */}
          <div className="relative">
            <button
              type="button"
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
                <span className="text-xs font-bold text-slate-900 truncate">{displayName}</span>
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  {displayRole} <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                </span>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
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
                    href="/projects"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    Projects Workspace
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    Settings & Profile
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    Help & Support
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
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

      {/* Enterprise Command Palette Modal (⌘K) */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsCommandOpen(false)}
          />
          <div className="relative z-50 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="h-4.5 w-4.5 text-[#7C3AED] shrink-0" />
              <input
                type="text"
                autoFocus
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                onKeyDown={handleCommandKeyDown}
                placeholder="Type a command, page, or search tasks..."
                className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setIsCommandOpen(false)}
                className="rounded-lg border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 hover:text-slate-700"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {commandItems.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <p className="text-xs font-semibold text-slate-500">
                    No matching pages or loaded tasks for &ldquo;{commandQuery}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({ search: commandQuery.trim(), page: 1 });
                      router.push('/tasks');
                      setIsCommandOpen(false);
                      setCommandQuery('');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-[#7C3AED] text-xs font-bold hover:bg-purple-100 transition-colors"
                  >
                    Search all tasks in database <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                commandItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        item.onSelect();
                        setIsCommandOpen(false);
                        setCommandQuery('');
                      }}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        isActive ? 'bg-purple-50 text-[#7C3AED]' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isActive
                              ? 'bg-[#7C3AED] text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{item.label}</div>
                          {item.subtitle && (
                            <div className="text-[11px] text-slate-400 truncate">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {item.group}
                        </span>
                        {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-[#7C3AED]" />}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="text-[#7C3AED] font-bold">TaskFlow Pro Command</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
