'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../ui/toast';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const toast = useToast();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await login(data);
      toast.success('Welcome back! Logging you in...');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Purple Column matching Screen 2 */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#2E0854] via-[#4A148C] to-[#6A1B9A] text-white p-8 sm:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo matching Screen 2 */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7C3AED] to-purple-400 text-white shadow-lg shadow-purple-950/40">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            TaskFlow <span className="text-purple-300 font-semibold">Pro</span>
          </span>
        </div>

        {/* Center Content matching Screen 2 */}
        <div className="relative z-10 my-auto py-12 max-w-md space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Welcome Back 👋
          </h1>
          <p className="text-sm sm:text-base text-purple-200/90 font-medium leading-relaxed">
            Sign in to your account and continue your productivity journey.
          </p>

          {/* Productivity Illustration matching Screen 2 */}
          <div className="pt-6 flex justify-center">
            <div className="relative w-72 h-56 flex items-center justify-center">
              {/* Desk, Laptop & Floating Task Cards Graphic */}
              <svg viewBox="0 0 300 220" className="w-full h-full drop-shadow-2xl">
                <rect x="20" y="180" width="260" height="8" rx="4" fill="#9333EA" opacity="0.6" />
                {/* Laptop base */}
                <rect x="75" y="160" width="150" height="20" rx="3" fill="#E2E8F0" />
                <rect x="120" y="172" width="60" height="4" rx="2" fill="#94A3B8" />
                {/* Laptop screen */}
                <rect x="85" y="80" width="130" height="85" rx="6" fill="#1E1B4B" />
                <rect x="90" y="85" width="120" height="75" rx="4" fill="#312E81" />
                <line x1="100" y1="100" x2="160" y2="100" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="115" x2="180" y2="115" stroke="#A5B4FC" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="130" x2="140" y2="130" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />
                {/* Floating Checkmark Pill 1 */}
                <rect x="20" y="50" width="110" height="34" rx="10" fill="#FFFFFF" />
                <circle cx="36" cy="67" r="7" fill="#10B981" />
                <path d="M33 67 L35 69 L39 64" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="50" y="62" width="60" height="4" rx="2" fill="#64748B" />
                <rect x="50" y="70" width="40" height="3" rx="1.5" fill="#CBD5E1" />
                {/* Floating Checkmark Pill 2 */}
                <rect x="175" y="30" width="110" height="34" rx="10" fill="#FFFFFF" />
                <circle cx="191" cy="47" r="7" fill="#7C3AED" />
                <path d="M188 47 L190 49 L194 44" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="205" y="42" width="60" height="4" rx="2" fill="#64748B" />
                <rect x="205" y="50" width="40" height="3" rx="1.5" fill="#CBD5E1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Left Bottom Tagline */}
        <div className="relative z-10 text-xs text-purple-300 font-medium">
          TaskFlow Pro Workspace Platform
        </div>
      </div>

      {/* Right Form Column matching Screen 2 */}
      <div className="lg:w-1/2 bg-white p-8 sm:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-left space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Enter your credentials to access your workspace
            </p>
          </div>

          {/* Global Error Banner */}
          {errorMsg && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="abdul@example.com"
                  {...register('email')}
                  className="h-11 w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="h-11 w-full pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-xs font-medium pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Password recovery link sent to your registered email.');
                }}
                className="font-bold text-[#7C3AED] hover:text-[#6D28D9]"
              >
                Forgot password?
              </a>
            </div>

            {/* Purple Sign In Button matching Screen 2 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Social Divider matching Screen 2 */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 shrink-0">
              Or continue with
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Google & GitHub Social Buttons matching Screen 2 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toast.info('Google OAuth integration ready.')}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => toast.info('GitHub OAuth integration ready.')}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer matching Screen 2 */}
          <div className="text-center pt-2 text-xs text-slate-500 font-medium">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
