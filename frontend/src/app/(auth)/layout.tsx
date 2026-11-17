'use client';

import * as React from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Column: Form Container */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>

      {/* Right Column: Visual Brand Showcase matching Image 2 */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-900 p-12 text-white items-center justify-center">
        {/* Background Decorative Rings / Waves */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 max-w-md space-y-6">
          {/* Floating Glass Metric Card 1 (Matching Image 2) */}
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/20 shadow-2xl space-y-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-200">
                Sprint Productivity
              </span>
              <span className="flex items-center text-xs font-bold text-emerald-300">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +24% vs last cycle
              </span>
            </div>
            <div className="text-3xl font-black tracking-tight">$348,200</div>
            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div className="h-full bg-emerald-400 w-4/5 rounded-full" />
            </div>
          </div>

          {/* Floating Glass Metric Card 2 (Matching Image 2) */}
          <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md border border-white/25 shadow-2xl space-y-2 transform translate-x-4 rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  Real-time Task Completion
                </span>
              </div>
              <span className="text-xs font-bold text-brand-200">98.4% Rate</span>
            </div>
            <p className="text-xs text-brand-100">
              Automated workflows and synchronized MongoDB state across your entire engineering team.
            </p>
          </div>

          {/* Bottom Heading & Pitch */}
          <div className="pt-6">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Introducing TaskFlow 2.0®
            </h2>
            <p className="mt-2 text-xs text-brand-200 leading-relaxed">
              Fast, enterprise-grade task orchestration and analytics built on the modern MERN stack. Designed for maximum engineering velocity and cross-user security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
