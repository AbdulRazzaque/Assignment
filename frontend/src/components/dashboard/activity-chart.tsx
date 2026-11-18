'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { MonthlyActivityItem } from '../../types';

interface ActivityChartProps {
  activity: MonthlyActivityItem[];
}

export function ActivityChart({ activity }: ActivityChartProps) {
  const [chartType, setChartType] = React.useState<'area' | 'bar'>('area');

  const chartData = activity.map((d) => ({
    month: d.month,
    completed: d.approved,
    inProgress: d.reviewed,
    total: d.total,
  }));

  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.completed + d.inProgress, d.completed)),
    5
  );
  const roundedMax = Math.ceil(maxVal / 5) * 5;

  const totalCompletedYear = chartData.reduce((acc, d) => acc + d.completed, 0);
  const totalInProgressYear = chartData.reduce((acc, d) => acc + d.inProgress, 0);

  return (
    <div className="card-premium p-6 flex flex-col justify-between h-full">
      {/* Header with Chart Type Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900">
              Task Completion Velocity
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] text-[10px] font-bold border border-purple-100">
              Live MongoDB
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monthly shipped vs. in-progress throughput ({totalCompletedYear} completed,{' '}
            {totalInProgressYear} active)
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" /> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C4B5FD]" /> In Progress
            </span>
          </div>

          {/* Toggle Area vs Stacked Bar */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setChartType('area')}
              title="Spline Area View"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                chartType === 'area'
                  ? 'bg-white text-[#7C3AED] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trend</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              title="Stacked Bar View"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                chartType === 'bar'
                  ? 'bg-white text-[#7C3AED] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Bars</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="indigoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                domain={[0, roundedMax]}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl bg-[#0F0F1C] px-3.5 py-2.5 text-white shadow-elevated border border-white/10 text-xs space-y-1.5">
                        <p className="font-bold text-purple-300">{label} {new Date().getFullYear()}</p>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-300">Completed:</span>
                          <span className="font-extrabold text-white tabular-nums">
                            {payload[0]?.value ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-300">In Progress:</span>
                          <span className="font-extrabold text-purple-200 tabular-nums">
                            {payload[1]?.value ?? 0}
                          </span>
                        </div>
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
                activeDot={{ r: 5, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stroke="#A78BFA"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#indigoAreaGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }}
                domain={[0, roundedMax]}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: '#F8FAFC' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl bg-[#0F0F1C] px-3.5 py-2.5 text-white shadow-elevated border border-white/10 text-xs space-y-1.5">
                        <p className="font-bold text-purple-300">{label} {new Date().getFullYear()}</p>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-300">Completed:</span>
                          <span className="font-extrabold text-white tabular-nums">
                            {payload[0]?.value ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-300">In Progress:</span>
                          <span className="font-extrabold text-purple-200 tabular-nums">
                            {payload[1]?.value ?? 0}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="completed"
                stackId="a"
                fill="#7C3AED"
                radius={[4, 4, 4, 4]}
                barSize={14}
              />
              <Bar
                dataKey="inProgress"
                stackId="a"
                fill="#DDD6FE"
                radius={[6, 6, 0, 0]}
                barSize={14}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
