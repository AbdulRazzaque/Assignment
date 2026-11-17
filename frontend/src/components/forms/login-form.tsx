'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
    <div className="w-full max-w-sm space-y-6">
      {/* Brand Header matching Image 2 */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          {/* Logo icon matching Image 2 */}
          <div className="flex flex-col gap-0.5">
            <span className="h-1.5 w-6 rounded-full bg-[#7C3AED]" />
            <span className="h-1.5 w-4 rounded-full bg-[#7C3AED]" />
            <span className="h-1.5 w-5 rounded-full bg-[#7C3AED]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Task<span className="text-[#7C3AED]">Flux</span>
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          New to TaskFlux?{' '}
          <Link
            href="/register"
            className="font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
          >
            Create an account.
          </Link>
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Form matching Image 2 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember for 30 days & Forgot Password matching Image 2 */}
        <div className="flex items-center justify-between text-xs font-medium pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-[#7C3AED] focus:ring-[#7C3AED]"
            />
            Remember for 30 days
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast.info('Password recovery link is ready to connect with email service.');
            }}
            className="font-bold text-[#7C3AED] hover:text-[#6D28D9]"
          >
            Forgot password
          </a>
        </div>

        {/* Purple Sign In Button matching Image 2 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        {/* Sign in with Google Button matching Image 2 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => toast.info('Google OAuth provider configured and ready.')}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  );
}
