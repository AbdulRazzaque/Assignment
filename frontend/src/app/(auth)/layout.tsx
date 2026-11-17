'use client';

import * as React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Column: Form Container matching Image 2 */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>

      {/* Right Column: Purple 3D Visual Banner with Floating Cards matching Image 2 */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#581C87] text-white items-center justify-center p-12">
        {/* Stylized 3D Ribbed Cylinder Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600 via-[#581c87] to-[#3b0764] opacity-95" />

        {/* 3D Arc / Vortex SVG overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="ribs" width="20" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#a855f7" strokeWidth="2" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ribs)" />
        </svg>

        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Floating Glass Card 1 (Top Left) matching Image 2 */}
          <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-2xl border border-white/20 w-56 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Sales account
            </span>
            <div className="flex items-center justify-between mt-1">
              <div>
                <span className="text-2xl font-black text-slate-900">$288k</span>
                <span className="block text-[10px] font-bold text-slate-400 mt-0.5">
                  ↗ 3.4% vs last year
                </span>
              </div>
              {/* Circular purple progress ring matching Image 2 */}
              <div className="relative h-10 w-10 flex items-center justify-center">
                <svg className="h-10 w-10 -rotate-90">
                  <circle cx="20" cy="20" r="14" stroke="#EDE9FE" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="20"
                    cy="20"
                    r="14"
                    stroke="#7C3AED"
                    strokeWidth="4"
                    strokeDasharray="88"
                    strokeDashoffset="24"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating Glass Card 2 (Center Line Chart) matching Image 2 */}
          <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-2xl border border-white/20 w-80 transform translate-x-12 rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-purple-600 mb-1">
              <span className="px-1.5 py-0.5 bg-purple-50 rounded">$58,144</span>
              <span className="px-1.5 py-0.5 bg-purple-50 rounded">$36,206</span>
            </div>
            {/* Smooth SVG Spline Chart matching Image 2 */}
            <div className="h-20 w-full">
              <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                <path
                  d="M0,45 Q20,38 40,40 T80,30 T120,20 T160,25 T200,10"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="120" cy="20" r="3" fill="#7C3AED" />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-2 border-t border-slate-100">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
          </div>

          {/* Floating Glass Card 3 (Bottom Right) matching Image 2 */}
          <div className="rounded-2xl bg-white p-4 text-slate-900 shadow-2xl border border-white/20 w-64 ml-auto transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <span className="text-2xl font-black text-slate-900 block">
              $58,144.80
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              ↗ $2,264.12 (+3.89%)
            </span>
          </div>

          {/* Marketing Pitch matching Image 2 */}
          <div className="pt-6 text-center text-white space-y-2">
            <h2 className="text-2xl font-black tracking-tight">
              Introducing AutoReports 2.0®
            </h2>
            <p className="text-xs text-purple-200 leading-relaxed max-w-sm mx-auto">
              You asked and we listened! Faster and more accurate automated reports. Sign in to explore!
            </p>
            {/* Carousel navigation dots matching Image 2 */}
            <div className="flex items-center justify-center gap-2 pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white/40 cursor-pointer" />
              <span className="h-1.5 w-5 rounded-full bg-white cursor-pointer" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40 cursor-pointer" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
