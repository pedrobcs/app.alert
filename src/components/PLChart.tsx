'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, YAxis, ReferenceLine, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartPoint } from '@/store/dashboardStore';

interface PLChartProps {
  data: ChartPoint[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0];
    return (
      <div className="rounded-2xl border border-white/10 bg-[var(--background)] px-4 py-3 shadow-lg">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">{label}</p>
        <p className="text-lg font-semibold text-[var(--foreground)]">{point.value.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

export function PLChart({ data, loading }: PLChartProps) {
  if (loading) {
    return (
      <Card className="p-0">
        <Skeleton className="h-[280px] w-full rounded-3xl" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">P/L trajectory</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">Performance curve</h3>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
          14d window
        </div>
      </div>
      <div className="mt-6 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="plGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff9a3c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff6a00" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--grid-dot)" strokeOpacity={0.4} vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="var(--grid-dot)" tick={{ fill: 'var(--muted)', fontSize: 12 }} dy={8} />
            <YAxis tickLine={false} axisLine={false} stroke="var(--grid-dot)" tick={{ fill: 'var(--muted)', fontSize: 12 }} width={40} />
            <ReferenceLine y={0} stroke="#ff9a3c" strokeDasharray="4 4" />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ff9a3c', strokeDasharray: '4 4' }} />
            <Line type="monotone" dataKey="pnl" stroke="#ff9a3c" strokeWidth={3} dot={{ strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
