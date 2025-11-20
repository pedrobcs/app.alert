'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { formatPercentage } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data - in production, this would come from your API
const mockPerformanceData = [
  { month: 'Jan', portfolio: 100, benchmark: 100 },
  { month: 'Feb', portfolio: 103.2, benchmark: 101.5 },
  { month: 'Mar', portfolio: 107.8, benchmark: 102.8 },
  { month: 'Apr', portfolio: 111.2, benchmark: 104.1 },
  { month: 'May', portfolio: 115.6, benchmark: 105.3 },
  { month: 'Jun', portfolio: 118.9, benchmark: 106.8 },
  { month: 'Jul', portfolio: 122.1, benchmark: 107.9 },
  { month: 'Aug', portfolio: 124.3, benchmark: 108.5 },
];

export default function PerformancePage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    fetchData();
  }, [isConnected]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Performance Analytics
          </h1>
          <p className="text-gray-600">
            Track the trading bot's performance over time
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              YTD Return
            </h3>
            <div className="text-3xl font-bold text-green-600">
              {formatPercentage(settings?.performanceYTD || 0)}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Current NAV
            </h3>
            <div className="text-3xl font-bold text-gray-900">
              ${settings?.currentNAV?.toFixed(4) || '1.0000'}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              Total AUM
            </h3>
            <div className="text-3xl font-bold text-gray-900">
              ${settings?.totalAUM?.toLocaleString() || '0'}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Portfolio Performance
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="ArbiBot Portfolio"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  name="BTC Buy & Hold"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategy Info */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Trading Strategy
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Asset Class:</strong> Bitcoin (BTC)
            </p>
            <p>
              <strong>Strategy Type:</strong> Algorithmic momentum and mean-reversion
            </p>
            <p>
              <strong>Risk Profile:</strong> Moderate to High
            </p>
            <p>
              <strong>Rebalancing:</strong> Dynamic, based on market conditions
            </p>
            <p className="text-sm text-gray-600 mt-4">
              The trading bot employs a systematic approach combining technical indicators,
              market microstructure analysis, and risk management to generate returns.
              Performance may vary based on market volatility and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
