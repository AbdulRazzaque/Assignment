import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '../components/ui/toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TaskFlow Pro — Enterprise Task Management SaaS',
  description:
    'Enterprise-grade task management platform with real-time MongoDB analytics, Kanban workflows, projects, tags, and role-safe JWT authentication.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen font-sans bg-[#F6F7FB] text-slate-900 antialiased selection:bg-brand-600/15 selection:text-brand-700">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
