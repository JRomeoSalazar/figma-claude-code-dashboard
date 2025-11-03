'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint } from '@/lib/types';

interface LineChartCardProps {
  title: string;
  data: DataPoint[] | null;
  color: string;
  unit?: string;
  formatValue?: (value: number) => string;
}

export default function LineChartCard({
  title,
  data,
  color,
  unit = '',
  formatValue
}: LineChartCardProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
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

  // Format data for chart - take last 60 points for readability
  const chartData = data.slice(-60).map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    value: point.value,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-3xl font-bold" style={{ color }}>
            {formattedValue}
          </div>
          <div className={`text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}% from previous
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '8px'
            }}
            formatter={(value: number) => [formatValue ? formatValue(value) : `${value.toFixed(2)}${unit}`, title]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-2">
        Last updated: {new Date(data[data.length - 1].date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>
  );
}
