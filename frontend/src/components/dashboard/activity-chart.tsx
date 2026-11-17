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
import { MonthlyActivityItem } from '../../types';

interface ActivityChartProps {
  activity: MonthlyActivityItem[];
}

export function ActivityChart({ activity }: ActivityChartProps) {
  const chartData = activity.map((d) => ({
    month: d.month,
    Approved: d.approved,
    Reviewed: d.reviewed,
    total: d.total,
  }));

  const maxVal = Math.max(...chartData.map((d) => d.Approved + d.Reviewed), 5);
  const roundedMax = Math.ceil(maxVal / 5) * 5;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xs border border-slate-100">
      {/* Header matching Image 1 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Monthly Review Activity
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real task approvals and reviews by month
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          This Year <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={16}>
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
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: '0.75rem',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [
                `${value} Tasks`,
                name === 'Approved' ? 'Completed Tasks' : 'In Progress Tasks',
              ]}
            />
            {/* Stacked purple bars matching Image 1 */}
            <Bar dataKey="Approved" stackId="a" fill="#7C3AED" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Reviewed" stackId="a" fill="#DDD6FE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Legend matching Image 1 */}
      <div className="flex items-center justify-center gap-6 pt-3 text-xs font-semibold text-slate-600 border-t border-slate-50 mt-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
          <span>Approved (Completed)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#DDD6FE]" />
          <span>Reviewed (In Progress)</span>
        </div>
      </div>
    </div>
  );
}
