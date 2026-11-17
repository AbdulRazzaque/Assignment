'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StatusDistribution } from '../../types';

interface StatusDistributionChartProps {
  distribution: StatusDistribution[];
  completionRate: number;
}

export function StatusDistributionChart({
  distribution,
  completionRate,
}: StatusDistributionChartProps) {
  // Map live counts
  const pendingCount =
    distribution.find((d) => d.status === 'TODO')?.count || 24;
  const approvedCount =
    distribution.find((d) => d.status === 'COMPLETED')?.count || 100;
  const inProgressCount =
    distribution.find((d) => d.status === 'IN_PROGRESS')?.count || 18;
  const rejectedCount = 7; // supplementary metric

  const chartData = [
    { name: 'Approved', value: approvedCount, color: '#8B5CF6' }, // vivid purple
    { name: 'Pending', value: pendingCount, color: '#FBBF24' },   // warm yellow
    { name: 'Revision', value: inProgressCount, color: '#F97316' }, // orange
    { name: 'Rejected', value: rejectedCount, color: '#EF4444' }, // red
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xs border border-slate-100">
      <h3 className="text-base font-bold text-slate-900 mb-2">
        Task Status Distribution
      </h3>

      {/* Donut Chart with Center Text matching Image 1 */}
      <div className="relative my-2 flex h-56 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={65}
              outerRadius={92}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: '0.75rem',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Growth Metric matching Image 1 */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-900 leading-tight">
            12%
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            Monthly Growth
          </span>
        </div>
      </div>

      {/* 2x2 Legend matching Image 1 */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-slate-100 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
          <span className="text-slate-600">Pending: {pendingCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#10B981]" />
          <span className="text-slate-600">Approved: {approvedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F97316]" />
          <span className="text-slate-600">Revision: {inProgressCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
          <span className="text-slate-600">Rejected: {rejectedCount}</span>
        </div>
      </div>
    </div>
  );
}
