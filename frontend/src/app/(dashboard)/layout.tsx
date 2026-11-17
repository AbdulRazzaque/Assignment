'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F4F5F9]">
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
    <div className="min-h-screen bg-[#F4F5F9] text-slate-900 antialiased flex flex-col">
      {/* Top Navigation Bar matching Image 1 & 4 */}
      <TopNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>

      {/* Global Modals */}
      <TaskModal />
      <DeleteTaskDialog />
    </div>
  );
}
