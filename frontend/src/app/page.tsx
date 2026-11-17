import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-100 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Task<span className="text-brand-600">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-brand-500/20 hover:bg-brand-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            <span>MERN Stack Production Assessment System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Streamlined Task Orchestration for{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              High-Velocity Teams
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Engineered with Next.js App Router, Express, TypeScript, and MongoDB Atlas.
            Experience secure HTTP-only cookie authentication, compound indexes, and live analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 text-sm font-bold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 transition-all hover:scale-[1.02]"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mx-auto mt-20 max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-purple-100 text-brand-600 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Cross-User Security & Isolation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every query and mutation strictly enforces authenticated ownership. HTTP-only JWT cookies eliminate token exposure in localStorage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              MongoDB Aggregation Analytics
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time pipeline aggregates status and priority distributions, calculates completion percentages, and tracks overdue milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Serverless Vercel Architecture
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clean separation of concerns with Next.js frontend and Express serverless deployment configuration with connection pooling.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        TaskFlow © 2026 — Production Full-Stack Assessment for Hammoq Infosystems
      </footer>
    </div>
  );
}
