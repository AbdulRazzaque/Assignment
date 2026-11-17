'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../ui/toast';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const toast = useToast();
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: true,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created! Welcome to TaskFlow Pro.');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Purple Column matching Screen 3 */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#2E0854] via-[#4A148C] to-[#6A1B9A] text-white p-8 sm:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo matching Screen 3 */}
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

        {/* Center Content matching Screen 3 */}
        <div className="relative z-10 my-auto py-10 max-w-md space-y-6">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Create Your Account
          </h1>

          {/* 4 Feature Checklist matching Screen 3 */}
          <div className="space-y-3 pt-2 text-sm text-purple-100 font-medium">
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/40 text-purple-200">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span>Get started in seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/40 text-purple-200">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span>Manage tasks & projects</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/40 text-purple-200">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span>Track your team&apos;s progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/40 text-purple-200">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span>Access from anywhere</span>
            </div>
          </div>

          {/* 3D Rocket Launching from Laptop Illustration matching Screen 3 */}
          <div className="pt-6 flex justify-center">
            <div className="relative w-64 h-52 flex items-center justify-center">
              <svg viewBox="0 0 260 200" className="w-full h-full drop-shadow-2xl">
                {/* Laptop base */}
                <rect x="30" y="150" width="200" height="15" rx="3" fill="#CBD5E1" />
                <rect x="90" y="160" width="80" height="3" rx="1.5" fill="#64748B" />
                {/* Screen */}
                <rect x="45" y="80" width="170" height="75" rx="5" fill="#1E1B4B" />
                <rect x="52" y="85" width="156" height="65" rx="3" fill="#312E81" />
                {/* Rocket Graphic launching upwards */}
                <g transform="translate(110, 20) rotate(-25)">
                  {/* Rocket flame */}
                  <polygon points="18,70 12,95 24,95" fill="#F97316" />
                  <polygon points="18,75 14,90 22,90" fill="#FACC15" />
                  {/* Rocket body */}
                  <path d="M6,30 Q18,0 30,30 L30,65 L6,65 Z" fill="#FFFFFF" />
                  <circle cx="18" cy="30" r="5" fill="#7C3AED" />
                  {/* Fins */}
                  <path d="M6,45 L0,65 L6,65 Z" fill="#9333EA" />
                  <path d="M30,45 L36,65 L30,65 Z" fill="#9333EA" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Left Bottom Tagline */}
        <div className="relative z-10 text-xs text-purple-300 font-medium">
          TaskFlow Pro Workspace Platform
        </div>
      </div>

      {/* Right Form Column matching Screen 3 */}
      <div className="lg:w-1/2 bg-white p-8 sm:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-left space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Join thousands of productive users
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Abdul Razzaque"
                  {...register('name')}
                  className="h-11 w-full pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name.message}</p>
              )}
            </div>

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

            {/* 2-Column Password & Confirm Password matching Screen 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="h-11 w-full pl-10 pr-9 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className="h-11 w-full pl-10 pr-9 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms Checkbox matching Screen 3 */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  {...register('terms')}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                />
                <span>
                  I agree to the{' '}
                  <span className="font-bold text-[#7C3AED] hover:underline">Terms of Service</span> and{' '}
                  <span className="font-bold text-[#7C3AED] hover:underline">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.terms.message}</p>
              )}
            </div>

            {/* Purple Submit Button matching Screen 3 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer matching Screen 3 */}
          <div className="text-center pt-2 text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
