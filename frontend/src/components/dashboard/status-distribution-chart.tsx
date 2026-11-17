'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StatusDistribution } from '../../types';

interface StatusDistributionChartProps {
  distribution: StatusDistribution[];
  completionRate: number;
  overdueCount?: number;
}

export function StatusDistributionChart({
  distribution,
  completionRate,
  overdueCount = 0,
}: StatusDistributionChartProps) {
  const pendingCount =
    distribution.find((d) => d.status === 'TODO')?.count || 0;
  const approvedCount =
    distribution.find((d) => d.status === 'COMPLETED')?.count || 0;
  const inProgressCount =
    distribution.find((d) => d.status === 'IN_PROGRESS')?.count || 0;

  const total = pendingCount + approvedCount + inProgressCount + overdueCount;

  // Chart data with fallback placeholder if 0 tasks
  const chartData =
    total === 0
      ? [{ name: 'No Tasks', value: 1, color: '#E2E8F0' }]
      : [
          { name: 'Approved', value: approvedCount, color: '#8B5CF6' }, // vivid purple
          { name: 'Pending', value: pendingCount, color: '#FBBF24' },   // warm yellow
          { name: 'In Progress', value: inProgressCount, color: '#F97316' }, // orange
          { name: 'Overdue', value: overdueCount, color: '#EF4444' }, // red
        ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xs border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900">
          Task Status Distribution
        </h3>
      </div>

      {/* Donut Chart with Center Text matching Image 1 */}
      <div className="relative my-2 flex h-56 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={65}
              outerRadius={92}
              paddingAngle={total > 0 ? 3 : 0}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {total > 0 && (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '0.75rem',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        {/* Center Growth Metric matching Image 1 */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-900 leading-tight">
            {total > 0 ? `${completionRate}%` : '0%'}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {total > 0 ? 'Completion Rate' : 'No Tasks Yet'}
          </span>
        </div>
      </div>

      {/* 2x2 Legend matching Image 1 */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-slate-100 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
          <span className="text-slate-600 truncate">Pending: {pendingCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
          <span className="text-slate-600 truncate">Approved: {approvedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F97316]" />
          <span className="text-slate-600 truncate">In Progress: {inProgressCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
          <span className="text-slate-600 truncate">Overdue: {overdueCount}</span>
        </div>
      </div>
    </div>
  );
}
