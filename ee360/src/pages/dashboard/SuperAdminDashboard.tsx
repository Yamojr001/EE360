import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Bird, Droplets, Layers, ArrowUpRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FarmDashboard from './FarmDashboard';
import WaterDashboard from './WaterDashboard';

const COLORS = ['oklch(0.52 0.18 175)', 'oklch(0.58 0.18 220)', 'oklch(0.62 0.18 140)', 'oklch(0.55 0.18 290)'];

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
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
      </div>
      <div className="h-72 bg-muted rounded-2xl" />
    </div>
  );

  const d = data ?? {};

  return (
    <Tabs defaultValue="both" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Command Centre</h1>
            <p className="text-sm text-muted-foreground">All sectors · Real-time overview</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5">
            <span className="text-sm text-muted-foreground font-medium">From:</span>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="bg-transparent text-sm font-medium outline-none text-foreground" />
            <span className="text-sm text-muted-foreground font-medium ml-1">To:</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="bg-transparent text-sm font-medium outline-none text-foreground" />
          </div>
          <TabsList>
            <TabsTrigger value="both">Combined</TabsTrigger>
            <TabsTrigger value="farm">Farm Only</TabsTrigger>
            <TabsTrigger value="water">Water Only</TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="both" className="space-y-6 mt-0">

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue"   value={formatCurrency(d.totalRevenue)}  icon={<TrendingUp className="w-4 h-4" />}  change={14.2} positive />
        <KpiCard label="Total Expenses"  value={formatCurrency(d.totalExpenses)} icon={<TrendingDown className="w-4 h-4" />} change={5.8}  positive={false} />
        <KpiCard label="Net Profit"      value={formatCurrency(d.netProfit)}     icon={<ArrowUpRight className="w-4 h-4" />}change={21.0} positive />
        <KpiCard label="Total Staff"     value={d.totalStaff ?? '—'}             icon={<Users className="w-4 h-4" />} />
      </div>

      {/* Sector Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {(d.sectorBreakdown ?? []).map((s: any) => (
          <div key={s.sector} className={cn(
            'border rounded-2xl p-5',
            s.sector === 'Farm' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                               : 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900',
          )}>
            <div className="flex items-center gap-2 mb-4">
              {s.sector === 'Farm' ? <Bird className="w-5 h-5 text-emerald-600" /> : <Droplets className="w-5 h-5 text-cyan-600" />}
              <h3 className="font-bold text-foreground">{s.sector} Sector</h3>
              <span className={cn('ml-auto text-xs font-semibold px-2 py-0.5 rounded-full', s.sector === 'Farm' ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-cyan-700')}>
                {s.workers} active workers
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Revenue',  value: formatCurrency(s.revenue)  },
                { label: 'Expenses', value: formatCurrency(s.expenses) },
                { label: 'Net',      value: formatCurrency(s.net),       highlight: s.net > 0 },
              ].map(item => (
                <div key={item.label} className="bg-white/60 dark:bg-white/5 rounded-xl p-3 text-center">
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
          <p className="text-xs text-muted-foreground mb-4">Farm vs Water — last 7 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={d.monthlyChart ?? []} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="farmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="oklch(0.52 0.18 175)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.52 0.18 175)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="oklch(0.55 0.18 220)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.18 220)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Legend />
              <Area type="monotone" dataKey="farm_revenue"  stroke="oklch(0.52 0.18 175)" fill="url(#farmGrad)"  name="Farm" />
              <Area type="monotone" dataKey="water_revenue" stroke="oklch(0.55 0.18 220)" fill="url(#waterGrad)" name="Water" />
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

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-bold text-foreground">Recent Activity</h3>
          <span className="ml-auto text-xs text-muted-foreground">Across all sectors</span>
        </div>
        <div className="space-y-2">
          {(d.recentActivity ?? []).map((a: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0',
                a.sector === 'Farm' ? 'bg-emerald-500' : 'bg-cyan-500')}>
                {a.sector === 'Farm' ? <Bird className="w-4 h-4" /> : <Droplets className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.desc}</p>
                <p className="text-xs text-muted-foreground">{a.sector} · {a.date}</p>
              </div>
              <span className="text-sm font-semibold text-primary shrink-0">{formatCurrency(a.amount)}</span>
            </div>
          ))}
        </div>
      </div>
      </TabsContent>

      <TabsContent value="farm" className="mt-0">
        <FarmDashboard />
      </TabsContent>

      <TabsContent value="water" className="mt-0">
        <WaterDashboard />
      </TabsContent>
    </Tabs>
  );
}
