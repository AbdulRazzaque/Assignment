'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  BarChart3,
  ShieldCheck,
  Command,
  Layers,
  Tags,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFD] text-slate-900 flex flex-col font-sans relative overflow-x-hidden">
      {/* Ambient Mesh Background */}
      <div className="pointer-events-none fixed inset-0 bg-grid-subtle opacity-60 z-0" />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[560px] z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -15%, rgba(124, 58, 237, 0.16), transparent 70%)',
        }}
      />

      {/* Sticky Glass Navigation */}
      <header className="sticky top-0 z-40 w-full glass-surface border-b border-slate-200/70 px-6 sm:px-10 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#A855F7] text-white shadow-glow group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 font-display">
              TaskFlow <span className="text-[#7C3AED]">Pro</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-[#7C3AED] transition-colors">
              Platform
            </a>
            <a href="#architecture" className="hover:text-[#7C3AED] transition-colors">
              Architecture
            </a>
            <Link href="/dashboard" className="hover:text-[#7C3AED] transition-colors">
              Live Workspace
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="mx-auto max-w-7xl px-6 sm:px-10 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#7C3AED] shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Enterprise MERN Task Management Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.08] font-display">
                Ship complex work with{' '}
                <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-indigo-600 bg-clip-text text-transparent">
                  precision & speed
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl leading-relaxed">
                TaskFlow Pro combines real-time MongoDB analytics, drag-and-drop Kanban boards,
                project milestones, colored tags, and a ⌘K Command Palette in one crisp,
                production-ready workspace.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] px-6 py-3.5 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Start Free Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs transition-all"
                >
                  <span>Sign In to Dashboard</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> JWT + HTTP-only Cookies
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> MongoDB Aggregations
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 100% TypeScript
                </span>
              </div>
            </div>

            {/* Right: High-Fidelity Interactive SaaS Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#7C3AED]/25 via-purple-400/15 to-indigo-400/20 blur-2xl" />

              <div className="relative rounded-2xl bg-[#0D0D16] p-2 shadow-2xl border border-white/15">
                {/* Browser Chrome Bar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="px-3 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-semibold text-slate-400">
                    app.taskflow.pro/dashboard
                  </div>
                  <div className="text-[10px] font-bold text-purple-300">⌘K</div>
                </div>

                {/* Inner Split Workspace Preview */}
                <div className="grid grid-cols-12 rounded-xl overflow-hidden bg-[#F6F7FB]">
                  {/* Dark Mini Sidebar */}
                  <div className="col-span-3 bg-[#10101A] p-3 space-y-2 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
                      <span className="h-4 w-4 rounded-md bg-[#7C3AED]" />
                      <span className="font-extrabold text-white">TaskFlow</span>
                    </div>
                    <div className="px-2 py-1.5 rounded-lg bg-[#7C3AED] text-white font-bold">
                      Dashboard
                    </div>
                    <div className="px-2 py-1 rounded-lg hover:bg-white/5">My Tasks</div>
                    <div className="px-2 py-1 rounded-lg hover:bg-white/5">Projects</div>
                    <div className="px-2 py-1 rounded-lg hover:bg-white/5">Kanban</div>
                    <div className="px-2 py-1 rounded-lg hover:bg-white/5">Reports</div>
                    <div className="px-2 py-1 rounded-lg hover:bg-white/5">Tags Studio</div>
                  </div>

                  {/* Main Preview Canvas */}
                  <div className="col-span-9 p-4 space-y-3">
                    <div className="rounded-xl bg-gradient-to-r from-[#121222] to-[#2E1065] p-3 text-white flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-purple-300 font-bold uppercase">
                          Command Center
                        </p>
                        <p className="text-xs font-extrabold mt-0.5">92% Sprint Velocity</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-[#7C3AED] text-[9px] font-bold">
                        + New Task
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Total', val: '248', color: 'text-slate-900' },
                        { label: 'Completed', val: '176', color: 'text-emerald-600' },
                        { label: 'Active', val: '42', color: 'text-[#7C3AED]' },
                      ].map((kpi) => (
                        <div
                          key={kpi.label}
                          className="rounded-xl bg-white p-2.5 border border-slate-200/70 shadow-2xs"
                        >
                          <p className="text-[9px] font-bold text-slate-400">{kpi.label}</p>
                          <p className={`text-base font-extrabold tabular-nums ${kpi.color}`}>
                            {kpi.val}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Visual Spline Chart Preview */}
                    <div className="rounded-xl bg-white p-3 border border-slate-200/70 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold text-slate-800">
                          Completion Trend
                        </span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          +24% velocity
                        </span>
                      </div>
                      <svg viewBox="0 0 260 64" className="w-full h-14 overflow-visible">
                        <defs>
                          <linearGradient id="heroChart" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 52 C 35 46, 55 34, 85 38 C 115 42, 145 18, 175 22 C 205 26, 230 8, 260 6 L 260 64 L 0 64 Z"
                          fill="url(#heroChart)"
                        />
                        <path
                          d="M0 52 C 35 46, 55 34, 85 38 C 115 42, 145 18, 175 22 C 205 26, 230 8, 260 6"
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="175" cy="22" r="3.5" fill="#7C3AED" stroke="#fff" strokeWidth="1.5" />
                        <circle cx="260" cy="6" r="3.5" fill="#7C3AED" stroke="#fff" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Feature Grid */}
        <section id="features" className="mx-auto max-w-7xl px-6 sm:px-10 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#7C3AED]">
              Built for Modern Engineering Teams
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Everything you need to plan, track, and ship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: FolderKanban,
                title: 'Drag-and-Drop Kanban & Table',
                desc: 'Switch effortlessly between high-density data tables, Kanban boards with optimistic updates, and deadline calendars.',
                color: 'bg-purple-50 text-[#7C3AED]',
              },
              {
                icon: Layers,
                title: 'Projects & Persistent Subtasks',
                desc: 'Group tasks into color-coded projects with live MongoDB progress aggregation and persistent checklist steps.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: BarChart3,
                title: 'Executive Analytics & Exports',
                desc: 'Interactive velocity charts, priority execution breakdowns, overdue risk radar, and 1-click CSV/JSON/PDF exports.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Tags,
                title: 'Tags Studio & Smart Filtering',
                desc: 'Create color-coded tags with cascade renaming across tasks and multi-criteria database filtering.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: Command,
                title: '⌘K Global Command Palette',
                desc: 'Keyboard-first navigation to jump across pages, search live tasks, or create work without leaving your flow.',
                color: 'bg-indigo-50 text-indigo-600',
              },
              {
                icon: ShieldCheck,
                title: 'Production Security Architecture',
                desc: 'Zod schema validation, JWT Bearer + HTTP-only cookies, rate limiting, Helmet headers, and strict tenant isolation.',
                color: 'bg-rose-50 text-rose-600',
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card-premium-hover p-6 space-y-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Dark CTA Banner */}
        <section id="architecture" className="mx-auto max-w-7xl px-6 sm:px-10 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E0E1A] via-[#1B1338] to-[#2E1065] p-8 sm:p-12 text-white shadow-elevated flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-70" />
            <div className="relative z-10 space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300">
                <Zap className="h-3.5 w-3.5" /> Ready to explore TaskFlow Pro?
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                Launch your workspace in seconds
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Full-stack Next.js 14 + TypeScript + Express + MongoDB architecture built for
                production reliability.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 hover:bg-purple-50 px-6 py-3 text-xs font-extrabold shadow-lg transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white px-5 py-3 text-xs font-bold transition-all"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
