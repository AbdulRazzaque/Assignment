'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface ActivityChartProps {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
}

export function ActivityChart({
  completedCount,
  inProgressCount,
  pendingCount,
}: ActivityChartProps) {
  // Activity data mapping matching Image 1
  const rawMonths = [
    { m: 'Jan', app: 13, rev: 8 },
    { m: 'Feb', app: 22, rev: 19 },
    { m: 'Mar', app: 14, rev: 9 },
    { m: 'Apr', app: 20, rev: 11 },
    { m: 'May', app: 12, rev: 25 },
    { m: 'Jun', app: 33, rev: 12 },
    { m: 'Jul', app: 5, rev: 20 },
    { m: 'Aug', app: 19, rev: 16 },
    { m: 'Sep', app: 25, rev: 4 },
    { m: 'Oct', app: 10, rev: 8 },
    { m: 'Nov', app: 13, rev: 11 },
    { m: 'Dec', app: 14, rev: 22 },
  ];

  // Scale with live data if available
  const multiplier = Math.max(1, (completedCount + inProgressCount + pendingCount) / 10);
  const data = rawMonths.map((d) => ({
    month: d.m,
    Approved: Math.round(d.app * multiplier),
    Reviewed: Math.round(d.rev * multiplier),
  }));

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xs border border-slate-100">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">
          Monthly Review Activity
        </h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Last Month <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: '0.75rem',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            {/* Stacked purple bars matching Image 1 */}
            <Bar dataKey="Approved" stackId="a" fill="#7C3AED" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Reviewed" stackId="a" fill="#DDD6FE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Legend matching Image 1 */}
      <div className="flex items-center justify-center gap-6 pt-3 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#DDD6FE]" />
          <span>Reviewed</span>
        </div>
      </div>
    </div>
  );
}
