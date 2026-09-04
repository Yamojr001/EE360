import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Bird, Droplets, Layers, ArrowUpRight, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FarmDashboard from './FarmDashboard';
import WaterDashboard from './WaterDashboard';

const COLORS = ['#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];

function KpiCard({ label, value, icon, change, positive, color }: any) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-5 flex flex-col gap-3', color)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      {change != null && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', positive ? 'text-emerald-600' : 'text-red-500')}>
          {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {change}% vs last month
        </div>
      )}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['super-summary', fromDate, toDate],
    queryFn: () => api.get('/dashboard/super-summary', { params: { from: fromDate, to: toDate } }).then(r => r.data),
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
      </div>
      <div className="h-64 bg-muted rounded-2xl" />
    </div>
  );

  const d = data ?? {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            Command Centre <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-sm text-muted-foreground">Combined Farm & Water operations overview</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="border rounded-lg px-3 py-1.5 text-xs bg-background text-foreground"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            className="border rounded-lg px-3 py-1.5 text-xs bg-background text-foreground"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Top Combined KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Business Revenue"
          value={formatCurrency(d.totalRevenue)}
          icon={<TrendingUp className="w-4 h-4" />}
          change={d.revChange}
          positive={(d.revChange ?? 0) >= 0}
        />
        <KpiCard
          label="Total Operating Expenses"
          value={formatCurrency(d.totalExpenses)}
          icon={<TrendingDown className="w-4 h-4 text-red-500" />}
          change={d.expChange}
          positive={(d.expChange ?? 0) <= 0}
        />
        <KpiCard
          label="Combined Net Profit"
          value={formatCurrency(d.combinedNet)}
          icon={<ArrowUpRight className="w-4 h-4" />}
          color="ring-2 ring-primary/20 bg-primary/5"
        />
        <KpiCard
          label="Sachet Water Bags Produced"
          value={(d.waterBagsProduced ?? 0).toLocaleString()}
          icon={<Droplets className="w-4 h-4 text-sky-500" />}
        />
      </div>

      {/* Sector breakdown quick cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {(d.sectorBreakdown ?? []).map((sec: any) => (
          <div key={sec.sector} className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                {sec.sector === 'Farm Sector' ? (
                  <div className="w-8 h-8 bg-purple-500/15 text-purple-600 rounded-lg flex items-center justify-center font-bold">
                    <Bird className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-amber-500/15 text-amber-600 rounded-lg flex items-center justify-center font-bold">
                    <Droplets className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-foreground">{sec.sector}</h3>
                  <p className="text-xs text-muted-foreground">Performance stats</p>
                </div>
              </div>
              <span className={cn('text-xs font-extrabold px-2.5 py-1 rounded-full', sec.net >= 0 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-red-100 text-red-800')}>
                Net: {formatCurrency(sec.net)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: 'Revenue',  value: formatCurrency(sec.revenue), highlight: true },
                { label: 'Expenses', value: formatCurrency(sec.expenses) },
                { label: 'Margin',   value: `${sec.revenue ? ((sec.net / sec.revenue) * 100).toFixed(1) : 0}%` },
              ].map(item => (
                <div key={item.label} className="bg-muted/40 rounded-xl p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={cn('text-sm font-bold', item.highlight ? 'text-primary' : 'text-foreground')}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Combined monthly revenue */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Monthly Revenue by Sector</h3>
          <p className="text-xs text-muted-foreground mb-4">Farm (Purple) vs Water (Gold) — last 7 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={d.monthlyChart ?? []} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="farmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${v.toLocaleString()}`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Legend />
              <Area type="monotone" dataKey="farm_revenue"  stroke="#8b5cf6" fill="url(#farmGrad)"  name="Farm" strokeWidth={2.5} />
              <Area type="monotone" dataKey="water_revenue" stroke="#f59e0b" fill="url(#waterGrad)" name="Water" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector net profit pie */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Sector Profit Contribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Share of total net profit</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={(d.sectorBreakdown ?? []).map((s: any) => ({ name: s.sector, value: Math.max(0, s.net) }))}
                cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                paddingAngle={4} dataKey="value"
              >
                {(d.sectorBreakdown ?? []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
