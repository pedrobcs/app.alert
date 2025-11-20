'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface PerformanceData {
  date: string;
  nav: string;
  dailyReturn?: string;
}

export function PerformanceChart() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  
  useEffect(() => {
    // In a real app, fetch from API
    // For now, generate mock data
    const mockData = generateMockData();
    setData(mockData);
    setLoading(false);
  }, [timeframe]);
  
  const generateMockData = () => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
    const data = [];
    let nav = 1.0;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Random daily return between -2% and 3%
      const dailyReturn = (Math.random() * 5 - 2) / 100;
      nav *= (1 + dailyReturn);
      
      data.push({
        date: date.toISOString(),
        nav: nav.toFixed(4),
        dailyReturn: (dailyReturn * 100).toFixed(2),
      });
    }
    
    return data;
  };
  
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), 'MMM dd'),
    NAV: parseFloat(item.nav),
  }));
  
  const currentNav = data.length > 0 ? parseFloat(data[data.length - 1].nav) : 1;
  const startNav = data.length > 0 ? parseFloat(data[0].nav) : 1;
  const totalReturn = ((currentNav - startNav) / startNav) * 100;
  
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Performance</h2>
          <p className={`text-2xl font-bold mt-2 ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
          </p>
        </div>
        
        <div className="flex gap-2">
          {['7d', '30d', '90d', 'all'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeframe === tf
                  ? 'bg-arbitrum text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner w-8 h-8"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="date"
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="NAV"
              stroke="#28A0F0"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
