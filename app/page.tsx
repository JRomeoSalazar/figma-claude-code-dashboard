'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  BarChart3,
  Globe,
  Home as HomeIcon,
  ShoppingCart,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import LineChartCard from '@/components/LineChartCard';
import StatCard from '@/components/StatCard';
import { EconomicData } from '@/lib/types';

const menuItems = [
  { id: 'key-indicators', name: 'Key Indicators', icon: TrendingUp },
  { id: 'inflation', name: 'Inflation', icon: TrendingDown },
  { id: 'employment', name: 'Employment', icon: Briefcase },
  { id: 'interest-rates', name: 'Interest Rates', icon: BarChart3 },
  { id: 'economic-growth', name: 'Economic Growth', icon: TrendingUp },
  { id: 'exchange-rates', name: 'Exchange Rates', icon: Globe },
  { id: 'housing', name: 'Housing', icon: HomeIcon },
  { id: 'consumer-spending', name: 'Consumer Spending', icon: ShoppingCart },
];

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('key-indicators');
  const [data, setData] = useState<EconomicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/fred?indicator=all');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load economic indicators. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(2)}T`;
  };

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-700 text-lg mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!data) {
      return null;
    }

    switch (selectedItem) {
      case 'key-indicators':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChartCard
              title="GDP (Gross Domestic Product)"
              data={data.gdp}
              color="#10b981"
              formatValue={formatCurrency}
            />
            <LineChartCard
              title="Unemployment Rate"
              data={data.unemployment}
              color="#3b82f6"
              unit="%"
            />
            <LineChartCard
              title="Consumer Price Index (Inflation)"
              data={data.inflation}
              color="#f59e0b"
              formatValue={(v) => v.toFixed(2)}
            />
            <LineChartCard
              title="Federal Funds Rate"
              data={data.interestRate}
              color="#8b5cf6"
              unit="%"
            />
          </div>
        );

      case 'inflation':
        return (
          <div className="space-y-6">
            <LineChartCard
              title="Consumer Price Index (All Items)"
              data={data.inflation}
              color="#f59e0b"
              formatValue={(v) => v.toFixed(2)}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current CPI"
                data={data.inflation}
                color="#f59e0b"
                formatValue={(v) => v.toFixed(2)}
              />
            </div>
          </div>
        );

      case 'employment':
        return (
          <div className="space-y-6">
            <LineChartCard
              title="Unemployment Rate"
              data={data.unemployment}
              color="#3b82f6"
              unit="%"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current Rate"
                data={data.unemployment}
                color="#3b82f6"
                unit="%"
              />
            </div>
          </div>
        );

      case 'interest-rates':
        return (
          <div className="space-y-6">
            <LineChartCard
              title="Federal Funds Effective Rate"
              data={data.interestRate}
              color="#8b5cf6"
              unit="%"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current Rate"
                data={data.interestRate}
                color="#8b5cf6"
                unit="%"
              />
            </div>
          </div>
        );

      case 'economic-growth':
        return (
          <div className="space-y-6">
            <LineChartCard
              title="Gross Domestic Product"
              data={data.gdp}
              color="#10b981"
              formatValue={formatCurrency}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current GDP"
                data={data.gdp}
                color="#10b981"
                formatValue={formatCurrency}
              />
            </div>
          </div>
        );

      case 'exchange-rates':
        return (
          <div className="space-y-6">
            <LineChartCard
              title="US Dollar to Euro Exchange Rate"
              data={data.exchangeRate}
              color="#06b6d4"
              formatValue={(v) => `€${v.toFixed(4)}`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current Rate"
                data={data.exchangeRate}
                color="#06b6d4"
                formatValue={(v) => `€${v.toFixed(4)}`}
              />
            </div>
          </div>
        );

      case 'housing':
        return (
          <div className="space-y-6">
            <LineChartCard
              title="Housing Starts"
              data={data.housing}
              color="#ec4899"
              formatValue={(v) => `${v.toFixed(0)}K units`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current Starts"
                data={data.housing}
                color="#ec4899"
                formatValue={(v) => `${v.toFixed(0)}K units`}
              />
            </div>
          </div>
        );

      case 'consumer-spending':
        return (
          <div className="space-y-6">
            <LineChartCard
              title="Personal Consumption Expenditures"
              data={data.spending}
              color="#f97316"
              formatValue={formatCurrency}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Current PCE"
                data={data.spending}
                color="#f97316"
                formatValue={formatCurrency}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">FRED Indicators</h1>
          <p className="text-sm text-gray-600 mt-1">Economic Data Dashboard</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {!isSelected && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Data provided by Federal Reserve Economic Data (FRED)
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Economic Indicators Dashboard
            </h2>
            <p className="text-gray-600">
              Real-time economic data from the Federal Reserve Economic Data (FRED) system
            </p>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
