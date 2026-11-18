'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { TopHeader } from '../../components/layout/top-header';
import { useAuthStore } from '../../store/authStore';
import { TaskModal } from '../../components/tasks/task-modal';
import { DeleteTaskDialog } from '../../components/tasks/delete-dialog';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitialized, checkAuth } = useAuthStore();
  const [checking, setChecking] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const initAuth = async () => {
      const isValid = await checkAuth();
      if (!isValid) {
        router.push('/login');
      } else {
        setChecking(false);
      }
    };

    if (!isInitialized) {
      initAuth();
    } else if (!isAuthenticated) {
      router.push('/login');
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, isInitialized, checkAuth, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0D0D14]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] text-white shadow-glow animate-pulse">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <p className="text-xs font-semibold tracking-wide text-slate-400">
            Loading TaskFlow Pro workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-slate-900 antialiased flex relative">
      {/* Subtle Ambient Top Glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-80 opacity-60 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 65% -10%, rgba(124, 58, 237, 0.08), transparent 70%)',
        }}
      />

      {/* Persistent Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] animate-slide-up">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <DeleteTaskDialog />
    </div>
  );
}
