'use client';

import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StatusDistribution } from '../../types';

interface StatusDistributionChartProps {
  distribution: StatusDistribution[];
  completionRate: number;
}

const COLORS: Record<string, string> = {
  TODO: '#F59E0B',        // amber
  IN_PROGRESS: '#7C3AED', // purple
  COMPLETED: '#10B981',   // emerald
};

export function StatusDistributionChart({
  distribution,
  completionRate,
}: StatusDistributionChartProps) {
  const chartData = distribution.map((item) => ({
    name: item.status === 'TODO' ? 'Pending' : item.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed',
    value: item.count,
    color: COLORS[item.status] || '#94A3B8',
  }));

  const hasData = distribution.some((d) => d.count > 0);

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-card border border-slate-100">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Task Status Distribution
        </h3>
        <p className="text-xs text-slate-400">Proportion of workflow states</p>
      </div>

      <div className="relative my-4 flex h-56 items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
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
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
            No tasks recorded yet
          </div>
        )}

        {/* Central Circular Rate Display (Matching Image 1) */}
        {hasData && (
          <div className="pointer-events-none absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900">
              {completionRate}%
            </span>
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
              Completed
            </span>
          </div>
        )}
      </div>

      {/* Legend below matching Image 1 */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
        {distribution.map((item) => (
          <div key={item.status} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[item.status] }}
              />
              <span className="font-medium text-[11px]">
                {item.status === 'TODO'
                  ? 'Pending'
                  : item.status === 'IN_PROGRESS'
                  ? 'In Progress'
                  : 'Completed'}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-800">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
