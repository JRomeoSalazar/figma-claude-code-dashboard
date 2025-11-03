'use client';

import { DataPoint } from '@/lib/types';

interface StatCardProps {
  title: string;
  data: DataPoint[] | null;
  color: string;
  unit?: string;
  formatValue?: (value: number) => string;
}

export default function StatCard({
  title,
  data,
  color,
  unit = '',
  formatValue
}: StatCardProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-gray-400">No data available</div>
      </div>
    );
  }

  const latestValue = data[data.length - 1]?.value;
  const previousValue = data[data.length - 2]?.value;
  const change = latestValue && previousValue ? ((latestValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = change >= 0;

  const formattedValue = formatValue
    ? formatValue(latestValue)
    : `${latestValue.toFixed(2)}${unit}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="text-3xl font-bold mb-2" style={{ color }}>
        {formattedValue}
      </div>
      <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}% from previous period
      </div>
      <p className="text-xs text-gray-500 mt-3">
        As of {new Date(data[data.length - 1].date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })}
      </p>
    </div>
  );
}
