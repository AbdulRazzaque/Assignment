'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { TopNavbar } from '../../components/layout/top-navbar';
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
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          <p className="text-xs font-semibold text-slate-500">
            Authenticating workspace session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-900">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <DeleteTaskDialog />
    </div>
  );
}
