'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import { MonthlyActivityItem } from '../../types';

interface ActivityChartProps {
  activity: MonthlyActivityItem[];
}

export function ActivityChart({ activity }: ActivityChartProps) {
  const chartData = activity.map((d) => ({
    month: d.month,
    completed: d.approved,
    inProgress: d.reviewed,
    total: d.total,
  }));

  const maxVal = Math.max(...chartData.map((d) => d.completed), 10);
  const roundedMax = Math.ceil(maxVal / 10) * 10;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-slate-100">
      {/* Header matching Screen 4 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Task Completion Trend
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            Monthly completed tasks performance
          </p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Chart Canvas: Spline Area Chart matching Screen 4 */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              domain={[0, roundedMax]}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl bg-slate-900 p-2.5 text-white shadow-xl text-xs space-y-1">
                      <p className="font-bold text-purple-300">{label} 2026</p>
                      <p className="font-extrabold text-sm">Completed: {payload[0].value}</p>
                      <p className="text-[10px] text-emerald-400 font-medium">+14% from previous</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#7C3AED"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#purpleAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
