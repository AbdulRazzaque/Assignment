'use client';

import * as React from 'react';
import {
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronDown,
  Keyboard,
  Send,
  Trash2,
  RefreshCw,
  BookOpen,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';
import { supportService } from '../../../services/workspace.service';
import { SupportCategory, SupportTicket, SystemHealth, TaskPriority } from '../../../types';
import { useToast } from '../../../components/ui/toast';

const FAQS = [
  {
    category: 'Tasks & Workflow',
    q: 'How do I move tasks across columns on the Kanban Board?',
    a: 'Open Kanban Board from the sidebar and drag any task card directly into To Do, In Progress, or Completed. Status updates persist immediately to MongoDB with optimistic UI updates.',
  },
  {
    category: 'Projects & Tags',
    q: 'Can I link tasks to Projects and apply multiple colored Tags?',
    a: 'Yes! Create projects in the Projects page and colored labels in Tags Studio. Then open any Create/Edit Task modal to attach a Project and toggle as many Tags as needed.',
  },
  {
    category: 'Productivity',
    q: 'How do I use the Global Command Palette?',
    a: 'Press ⌘K (Mac) or Ctrl+K (Windows/Linux) from anywhere in the workspace to search tasks, navigate pages instantaneously, or trigger Quick New Task without touching your mouse.',
  },
  {
    category: 'Data & Exports',
    q: 'Can I export my tasks and analytics reports?',
    a: 'Yes. In My Tasks you can export filtered tasks as CSV, and in Reports & Analytics you can export full executive summaries in CSV, JSON, or Print-to-PDF formats.',
  },
  {
    category: 'Security & API',
    q: 'How is my workspace data protected?',
    a: 'All API endpoints are protected with signed JWT Bearer authentication, Zod schema validation, rate limiting, Helmet security headers, and strict userId-level tenant isolation in MongoDB.',
  },
];

const SHORTCUTS = [
  { keys: ['⌘ / Ctrl', 'K'], desc: 'Open Global Command Palette' },
  { keys: ['ESC'], desc: 'Close active modal or popover' },
  { keys: ['↑', '↓'], desc: 'Navigate Command Palette items' },
  { keys: ['↵ Enter'], desc: 'Execute selected command or search' },
];

export default function HelpSupportPage() {
  const toast = useToast();

  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [latencyMs, setLatencyMs] = React.useState<number | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = React.useState(false);

  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = React.useState(true);

  const [faqSearch, setFaqSearch] = React.useState('');
  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(0);

  // Support ticket form
  const [subject, setSubject] = React.useState('');
  const [category, setCategory] = React.useState<SupportCategory>('BUG');
  const [priority, setPriority] = React.useState<TaskPriority>('MEDIUM');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const runHealthCheck = React.useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      const res = await supportService.checkHealth();
      setHealth(res.health);
      setLatencyMs(res.latencyMs);
    } catch {
      setHealth({ status: 'offline', database: 'unreachable', timestamp: new Date().toISOString() });
      setLatencyMs(null);
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  const loadTickets = React.useCallback(async () => {
    setIsLoadingTickets(true);
    try {
      const data = await supportService.getTickets();
      setTickets(data);
    } catch {
      // silent
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  React.useEffect(() => {
    runHealthCheck();
    loadTickets();
  }, [runHealthCheck, loadTickets]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim().length < 3) {
      toast.error('Subject must be at least 3 characters');
      return;
    }
    if (message.trim().length < 10) {
      toast.error('Please describe your issue in at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await supportService.createTicket({
        subject: subject.trim(),
        category,
        priority,
        message: message.trim(),
      });
      toast.success('Support ticket submitted! Saved to your workspace history.');
      setSubject('');
      setMessage('');
      setPriority('MEDIUM');
      await loadTickets();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await supportService.deleteTicket(id);
      toast.success('Ticket closed and removed');
      await loadTickets();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove ticket');
    }
  };

  const filteredFaqs = FAQS.filter(
    (f) =>
      !faqSearch.trim() ||
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const isHealthy = health?.status === 'healthy';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Help & Support Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Documentation, keyboard shortcuts, live API telemetry, and direct support tickets.
          </p>
        </div>

        <button
          type="button"
          onClick={runHealthCheck}
          disabled={isCheckingHealth}
          className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
          <span>Ping System Status</span>
        </button>
      </div>

      {/* Live API & MongoDB Health Banner */}
      <div
        className={`rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isHealthy
            ? 'bg-emerald-50/70 border-emerald-200'
            : 'bg-amber-50/70 border-amber-200'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isHealthy ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {isHealthy ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900">
                {isHealthy ? 'All Systems Operational' : 'Checking API Health...'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                <Activity className="h-3 w-3" />
                {latencyMs !== null ? `${latencyMs}ms latency` : 'Live'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              REST API: <strong>{health?.status || 'checking'}</strong> · MongoDB Cluster:{' '}
              <strong>{health?.database || 'connected'}</strong>
              {health?.uptimeSeconds !== undefined && (
                <> · Uptime: <strong>{Math.floor(health.uptimeSeconds / 60)}m</strong></>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>TLS / JWT Secured</span>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Knowledge Base + Keyboard Shortcuts (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Knowledge Base / FAQs */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-[#7C3AED]" />
                <h3 className="text-base font-extrabold text-slate-900">Knowledge Base & FAQs</h3>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search docs..."
                  className="h-8 w-full pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:border-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                          {faq.category}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          {faq.q}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-[#7C3AED]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Keyboard className="h-4.5 w-4.5 text-[#7C3AED]" />
              <h3 className="text-base font-extrabold text-slate-900">Keyboard Shortcuts</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SHORTCUTS.map((sc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="text-xs font-semibold text-slate-700">{sc.desc}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {sc.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-700 shadow-2xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Submit Support Ticket + Ticket History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Submit Ticket Form */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-4.5 w-4.5 text-[#7C3AED]" />
              <h3 className="text-base font-extrabold text-slate-900">Submit a Support Ticket</h3>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your request"
                  required
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportCategory)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none"
                  >
                    <option value="BUG">Bug Report</option>
                    <option value="FEATURE">Feature Request</option>
                    <option value="ACCOUNT">Account Issue</option>
                    <option value="SECURITY">Security</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-[#7C3AED] focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide steps to reproduce or details about your question..."
                  required
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] py-2.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 transition-all disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
              </button>
            </form>
          </div>

          {/* Ticket History */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#7C3AED]" />
                <h3 className="text-sm font-extrabold text-slate-900">Your Support Tickets</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] text-[10px] font-bold">
                {tickets.length}
              </span>
            </div>

            {isLoadingTickets ? (
              <p className="text-xs text-slate-400 py-4 text-center">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No support tickets submitted yet.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {tickets.map((t) => (
                  <div
                    key={t._id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{t.subject}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteTicket(t._id)}
                        title="Close ticket"
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{t.message}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                          {t.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          {t.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {format(new Date(t.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
