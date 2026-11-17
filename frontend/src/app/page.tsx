'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  LineChart,
  Layers,
  ChevronDown,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFE] text-slate-900 flex flex-col font-sans selection:bg-[#7C3AED]/20 selection:text-[#7C3AED]">
      {/* Top Navigation Bar matching Screen 1 */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 sm:px-12 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo matching Screen 1 */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] text-white shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              TaskFlow <span className="text-[#7C3AED]">Pro</span>
            </span>
          </Link>

          {/* Center Links matching Screen 1 */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <Link href="#product" className="hover:text-slate-900 transition-colors">
              Product
            </Link>
            <Link href="#solutions" className="hover:text-slate-900 transition-colors">
              Solutions
            </Link>
            <Link href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors">
              <span>Resources</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          </nav>

          {/* Right Action Buttons matching Screen 1 */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section matching Screen 1 */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge matching Screen 1 */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50/70 px-4 py-1.5 text-xs font-bold text-[#7C3AED] shadow-2xs">
              <span>🚀</span>
              <span>Task Management for Modern Teams</span>
            </div>

            {/* Headline matching Screen 1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Organize, Collaborate <br />
              and Deliver Work <br />
              <span className="text-[#7C3AED]">Faster</span>
            </h1>

            {/* Subtitle matching Screen 1 */}
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl leading-relaxed">
              A powerful and flexible task management platform that helps individuals and teams plan, track, and ship work efficiently.
            </p>

            {/* Call to action buttons matching Screen 1 */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3 text-sm font-bold text-slate-700 shadow-2xs transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Social Proof matching Screen 1 */}
            <div className="pt-2 text-xs font-semibold text-slate-400">
              Trusted by 10,000+ productive teams
            </div>
          </div>

          {/* Right Hero Isometric Dashboard Mockup matching Screen 1 (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Glowing violet background ambient glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#7C3AED]/20 to-purple-400/10 blur-2xl" />

            {/* Isometric Preview Card matching Screen 1 */}
            <div className="relative rounded-3xl bg-white p-4 shadow-2xl border border-slate-200/80 transform hover:-rotate-1 transition-transform duration-500 max-w-md w-full">
              {/* Mini Mockup Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">taskflow-pro.app/dashboard</span>
              </div>

              {/* Mini Mockup Visual Cards */}
              <div className="pt-3 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <span className="text-[9px] font-bold text-slate-400 block">Total Tasks</span>
                    <span className="text-base font-extrabold text-slate-900">248</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[9px] font-bold text-slate-400 block">Completed</span>
                    <span className="text-base font-extrabold text-slate-900">176</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <span className="text-[9px] font-bold text-slate-400 block">In Progress</span>
                    <span className="text-base font-extrabold text-slate-900">42</span>
                  </div>
                </div>

                {/* Spline preview graphic */}
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-2">
                    <span>Task Completion Trend</span>
                    <span className="text-purple-600 font-extrabold">+14% MoM</span>
                  </div>
                  <svg viewBox="0 0 200 45" className="w-full h-12 overflow-visible">
                    <defs>
                      <linearGradient id="landingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,35 Q30,30 60,25 T120,15 T180,8 L200,5 L200,45 L0,45 Z"
                      fill="url(#landingGrad)"
                    />
                    <path
                      d="M0,35 Q30,30 60,25 T120,15 T180,8 L200,5"
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges Row matching Screen 1 */}
        <div className="mx-auto max-w-7xl w-full pt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-card transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Task Management</h4>
                <p className="text-[11px] text-slate-400 font-medium">Stay organised</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-card transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Team Collaboration</h4>
                <p className="text-[11px] text-slate-400 font-medium">Work together</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-card transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Progress Tracking</h4>
                <p className="text-[11px] text-slate-400 font-medium">Measure & improve</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-card transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Analytics & Reports</h4>
                <p className="text-[11px] text-slate-400 font-medium">Get deep insights</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 px-6 sm:px-12 text-center text-xs text-slate-400">
        TaskFlow Pro © 2026 — Enterprise SaaS Task Management System
      </footer>
    </div>
  );
}
