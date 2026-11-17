'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { TopHeader } from '../../components/layout/top-header';
import { useAuthStore } from '../../store/authStore';
import { TaskModal } from '../../components/tasks/task-modal';
import { DeleteTaskDialog } from '../../components/tasks/delete-dialog';
import { Loader2 } from 'lucide-react';

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
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F4F5F9]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
          <p className="text-xs font-semibold text-slate-500">
            Authenticating workspace session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-slate-900 antialiased flex">
      {/* Persistent Left Sidebar matching Image 3 */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header matching Image 3 & Image 4 */}
        <TopHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable Main Content */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <DeleteTaskDialog />
    </div>
  );
}
