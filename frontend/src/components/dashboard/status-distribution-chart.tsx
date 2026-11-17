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

  // Real percentages
  const completedPct = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pendingCount / total) * 100) : 0;
  const overduePct = total > 0 ? Math.round((overdueCount / total) * 100) : 0;

  const chartData =
    total === 0
      ? [{ name: 'No Tasks', value: 1, color: '#E2E8F0' }]
      : [
          { name: 'Completed', value: approvedCount, color: '#7C3AED' }, // purple
          { name: 'In Progress', value: inProgressCount, color: '#3B82F6' }, // blue
          { name: 'Pending', value: pendingCount, color: '#F59E0B' }, // amber
          { name: 'Overdue', value: overdueCount, color: '#EF4444' }, // red
        ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 shadow-xs border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Task Status Distribution
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto py-2">
        {/* Donut Chart with Center Text matching Screen 4 */}
        <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={55}
                outerRadius={75}
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

          {/* Center Metric matching Screen 4: e.g. "248 Tasks" */}
          <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-900 leading-tight">
              {total}
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              Tasks
            </span>
          </div>
        </div>

        {/* Legend matching Screen 4 */}
        <div className="flex flex-col gap-2.5 text-xs font-semibold w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
              <span className="text-slate-600">Completed</span>
            </div>
            <span className="font-extrabold text-slate-900">{completedPct}%</span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
              <span className="text-slate-600">In Progress</span>
            </div>
            <span className="font-extrabold text-slate-900">{inProgressPct}%</span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
              <span className="text-slate-600">Pending</span>
            </div>
            <span className="font-extrabold text-slate-900">{pendingPct}%</span>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#EF4444]" />
              <span className="text-slate-600">Overdue</span>
            </div>
            <span className="font-extrabold text-slate-900">{overduePct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
