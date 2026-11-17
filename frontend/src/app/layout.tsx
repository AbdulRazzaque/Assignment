import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '../components/ui/toast';

export const metadata: Metadata = {
  title: 'TaskFlow — Production Task Management SaaS',
  description:
    'Enterprise-grade task management system with real-time analytics, MongoDB aggregation, and role-safe authentication.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans bg-slate-50 antialiased selection:bg-brand-500 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
