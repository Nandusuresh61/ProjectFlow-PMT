import { useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import { format, parseISO } from 'date-fns';
import type { BurndownResponseData } from '@/services/sprint/sprint.api';

interface SprintBurndownChartProps {
  data: BurndownResponseData;
}

export const SprintBurndownChart = ({ data }: SprintBurndownChartProps) => {
  const chartData = useMemo(() => {
    // Create a map of all unique dates using ISO string as key for proper sorting
    const dateMap = new Map<string, { date: string; displayDate: string; ideal?: number; actual?: number }>();

    data.idealLine.forEach(p => {
      const isoDate = format(parseISO(p.date), 'yyyy-MM-dd');
      const displayDate = format(parseISO(p.date), 'MMM dd');
      dateMap.set(isoDate, { date: isoDate, displayDate, ideal: p.remainingHours });
    });

    data.actualLine.forEach(p => {
      const isoDate = format(parseISO(p.date), 'yyyy-MM-dd');
      const displayDate = format(parseISO(p.date), 'MMM dd');
      const existing = dateMap.get(isoDate);
      if (existing) {
        existing.actual = p.remainingHours;
      } else {
        dateMap.set(isoDate, { date: isoDate, displayDate, actual: p.remainingHours });
      }
    });

    return Array.from(dateMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        ...item,
        date: item.displayDate // Recharts will use this for the axis
      }));
  }, [data]);

  const latestActual = data.actualLine.length > 0 ? data.actualLine[data.actualLine.length - 1] : null;
  const latestIdeal = latestActual ? data.idealLine.find(p => format(parseISO(p.date), 'yyyy-MM-dd') === format(parseISO(latestActual.date), 'yyyy-MM-dd')) : null;

  const getSprintHealth = () => {
    if (!latestActual || !latestIdeal) return { label: 'On Track', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    
    const diff = latestActual.remainingHours - latestIdeal.remainingHours;
    if (diff > 2) return { label: 'Behind Schedule', color: 'text-rose-400', bg: 'bg-rose-400/10' };
    if (diff < -2) return { label: 'Ahead of Schedule', color: 'text-[#A5D7E8]', bg: 'bg-[#A5D7E8]/10' };
    return { label: 'On Track', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  };

  const health = getSprintHealth();

  return (
    <div className="bg-white/[0.025] rounded-2xl p-6 border border-white/[0.05]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Sprint Burndown</h3>
          <p className="text-sm text-white/40">Remaining engineering effort vs. ideal trend</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${health.bg} ${health.color}`}>
          {health.label}
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A5D7E8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#A5D7E8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(11, 36, 71, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '4px', fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="none"
              fillOpacity={1}
              fill="url(#actualGradient)"
            />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="rgba(255,255,255,0.15)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
              name="Ideal Burndown"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#A5D7E8" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#A5D7E8', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#A5D7E8', stroke: 'rgba(255,255,255,0.2)', strokeWidth: 4 }}
              name="Actual Remaining"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.05]">
        <div>
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-1">Scope</p>
          <p className="text-lg font-black text-white">{data.metrics.totalEstimatedHours}h</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-1">Logged</p>
          <p className="text-lg font-black text-white">{data.metrics.loggedHours}h</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-1">Open</p>
          <p className="text-lg font-black text-white">{data.metrics.currentRemainingHours}h</p>
        </div>
      </div>
    </div>
  );
};
