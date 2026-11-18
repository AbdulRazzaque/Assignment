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
  const pendingCount = distribution.find((d) => d.status === 'TODO')?.count || 0;
  const approvedCount = distribution.find((d) => d.status === 'COMPLETED')?.count || 0;
  const inProgressCount = distribution.find((d) => d.status === 'IN_PROGRESS')?.count || 0;

  const total = pendingCount + approvedCount + inProgressCount;

  const rows = [
    {
      name: 'Completed',
      count: approvedCount,
      pct: total > 0 ? Math.round((approvedCount / total) * 100) : 0,
      color: '#7C3AED',
      bg: 'bg-purple-50 text-[#7C3AED]',
    },
    {
      name: 'In Progress',
      count: inProgressCount,
      pct: total > 0 ? Math.round((inProgressCount / total) * 100) : 0,
      color: '#3B82F6',
      bg: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Pending',
      count: pendingCount,
      pct: total > 0 ? Math.round((pendingCount / total) * 100) : 0,
      color: '#F59E0B',
      bg: 'bg-amber-50 text-amber-600',
    },
    {
      name: 'Overdue',
      count: overdueCount,
      pct: total > 0 ? Math.round((overdueCount / total) * 100) : 0,
      color: '#EF4444',
      bg: 'bg-rose-50 text-rose-600',
    },
  ];

  const chartData =
    total === 0
      ? [{ name: 'No Tasks', value: 1, color: '#E2E8F0' }]
      : [
          { name: 'Completed', value: approvedCount, color: '#7C3AED' },
          { name: 'In Progress', value: inProgressCount, color: '#3B82F6' },
          { name: 'Pending', value: pendingCount, color: '#F59E0B' },
        ].filter((d) => d.value > 0);

  return (
    <div className="card-premium p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Status Distribution
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real-time workflow health breakdown
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold tabular-nums">
          {total} total
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto py-1">
        {/* Donut Chart with Center Completion Gauge */}
        <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={56}
                outerRadius={76}
                paddingAngle={total > 0 ? 4 : 0}
                cornerRadius={6}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {total > 0 && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F0F1C',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-slate-900 leading-none tabular-nums font-display">
              {completionRate}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
              Done
            </span>
          </div>
        </div>

        {/* Rich Progress Legend */}
        <div className="flex flex-col gap-3 w-full">
          {rows.map((row) => (
            <div key={row.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                  />
                  {row.name}
                </span>
                <span className="font-extrabold text-slate-900 tabular-nums">
                  {row.count}{' '}
                  <span className="text-slate-400 font-semibold text-[11px]">
                    ({row.pct}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${row.pct}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
