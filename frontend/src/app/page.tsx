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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-purple-500 text-white shadow-md shadow-brand-500/20">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Task<span className="text-[#7C3AED]">Flux</span>
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
              className="rounded-xl bg-[#7C3AED] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-purple-500/20 hover:bg-[#6D28D9] transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold text-[#7C3AED] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
            <span>MERN Stack Production Task Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Streamlined Task Orchestration for{' '}
            <span className="bg-gradient-to-r from-[#7C3AED] to-purple-600 bg-clip-text text-transparent">
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
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-8 text-sm font-bold text-white shadow-md shadow-purple-500/25 hover:bg-[#6D28D9] transition-all hover:scale-[1.02]"
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        TaskFlux © 2026 — Production Full-Stack Assessment for Hammoq Infosystems
      </footer>
    </div>
  );
}
