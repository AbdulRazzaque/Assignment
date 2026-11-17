'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Settings as SettingsIcon,
  Search,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

export function TopNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const navTabs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/tasks' },
    { label: 'Task Review', href: '/dashboard' },
    { label: 'Members', href: '/settings' },
    { label: 'AI Assistant', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 transition-all">
      <div className="mx-auto flex items-center justify-between gap-4 max-w-7xl">
        {/* Left: Brand Logo matching Image 1 & Image 4 */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            {/* 4-pointed spark star icon matching Image 1 */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-purple-500 text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Task<span className="text-brand-600">Flux</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Pill Tabs matching Image 1 */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1 rounded-full border border-slate-200/60 shadow-xs">
          {navTabs.map((tab) => {
            const isActive =
              (tab.label === 'Dashboard' && pathname === '/dashboard') ||
              (tab.label === 'Task Review' && pathname === '/dashboard') ||
              (tab.label === 'Projects' && pathname.startsWith('/tasks')) ||
              (tab.label === 'Members' && pathname.startsWith('/settings'));

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Search, Settings, Notifications, User Avatar matching Image 1 & 4 */}
        <div className="flex items-center gap-3">
          {/* Quick Search Input matching Image 4 */}
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search here..."
              className="h-9 w-48 xl:w-56 pl-9 pr-3 rounded-full border border-slate-200/80 bg-slate-50/60 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 transition-all"
            />
          </div>

          {/* Settings Gear Icon matching Image 1 */}
          <Link
            href="/settings"
            title="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <SettingsIcon className="h-4 w-4" />
          </Link>

          {/* Notification Bell with Badge matching Image 1 */}
          <button
            title="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* User Profile Avatar with dropdown matching Image 1 */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-100 shadow-sm overflow-hidden">
                {user?.name ? (
                  <span>{user.name.slice(0, 2).toUpperCase()}</span>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user?.name || 'Workspace User'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user?.email}
                  </p>
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mt-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-xl md:hidden space-y-1">
          {navTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-xl"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
