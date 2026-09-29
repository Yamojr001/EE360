import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { 
  Droplets, TrendingUp, Wallet, Package, ArrowUpRight, 
  Scale, AlertCircle, FileMinus, Calendar, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function KpiCard({ label, value, icon, sub, color, alert }: any) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-5 flex flex-col justify-between', color)}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", alert ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-primary/10 text-primary")}>
            {icon}
          </div>
        </div>
        <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
      </div>
      {sub && <p className="text-xs text-muted-foreground mt-2 border-t border-border/50 pt-1.5">{sub}</p>}
    </div>
  );
}

export default function WaterDashboard() {
  const getInitialDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];
    return { firstDay, today };
  };

  const { firstDay, today } = getInitialDates();
  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState<'month' | 'today' | 'week' | 'all'>('month');

  const setPreset = (type: 'month' | 'today' | 'week' | 'all') => {
    setActiveFilter(type);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (type === 'today') {
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (type === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setFromDate(d.toISOString().split('T')[0]);
      setToDate(todayStr);
    } else if (type === 'month') {
      setFromDate(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
      setToDate(todayStr);
    } else if (type === 'all') {
      setFromDate('2024-01-01');
      setToDate(todayStr);
    }
  };

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['water-summary', fromDate, toDate],
    queryFn: () => api.get('/dashboard/water-summary', { params: { from: fromDate, to: toDate } }).then(r => r.data),
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
      </div>
      <div className="h-64 bg-muted rounded-2xl" />
    </div>
  );

  const d = data ?? {};
  const prodMinusSold = d.productionMinusSold ?? 0;

  return (
    <div className="space-y-6">
      {/* Header & Date Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Water Dashboard</h1>
            <p className="text-xs text-muted-foreground">Production, sales revenue, debts & stock balances</p>
          </div>
        </div>

        {/* Date Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-muted p-1 rounded-xl gap-1 text-xs">
            <button
              onClick={() => setPreset('today')}
              className={cn("px-2.5 py-1 rounded-lg font-medium transition-all", activeFilter === 'today' ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground")}
            >
              Today
            </button>
            <button
              onClick={() => setPreset('week')}
              className={cn("px-2.5 py-1 rounded-lg font-medium transition-all", activeFilter === 'week' ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground")}
            >
              7 Days
            </button>
            <button
              onClick={() => setPreset('month')}
              className={cn("px-2.5 py-1 rounded-lg font-medium transition-all", activeFilter === 'month' ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground")}
            >
              This Month
            </button>
            <button
              onClick={() => setPreset('all')}
              className={cn("px-2.5 py-1 rounded-lg font-medium transition-all", activeFilter === 'all' ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground")}
            >
              All Time
            </button>
          </div>

          <div className="flex items-center gap-1.5 border border-border bg-background rounded-xl px-2.5 py-1 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="date"
              className="text-xs bg-transparent text-foreground outline-none cursor-pointer"
              value={fromDate}
              onChange={e => { setFromDate(e.target.value); setActiveFilter('month'); }}
            />
            <span className="text-xs text-muted-foreground">to</span>
            <input
              type="date"
              className="text-xs bg-transparent text-foreground outline-none cursor-pointer"
              value={toDate}
              onChange={e => { setToDate(e.target.value); setActiveFilter('month'); }}
            />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8 rounded-xl"
            onClick={() => refetch()} 
            disabled={isFetching}
            title="Refresh statistics"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-amber-500")} />
          </Button>
        </div>
      </div>

      {/* Primary KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Water Revenue */}
        <KpiCard 
          label="Water Revenue (Total Sales)" 
          value={formatCurrency(d.revenue ?? 0)} 
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          sub={`${(d.totalBagsSold ?? 0).toLocaleString()} bags sold @ avg ${formatCurrency(d.avgPricePerBag ?? 0)}/bag`}
        />

        {/* 2. Production vs Dispatched (Sold + Drawings) */}
        <KpiCard 
          label="Water Production − Dispatched" 
          value={`${prodMinusSold >= 0 ? '+' : ''}${prodMinusSold.toLocaleString()} bags`} 
          icon={<Scale className="w-4 h-4 text-amber-600" />}
          sub={`Produced: ${(d.totalBagsProduced ?? 0).toLocaleString()} | Dispatched: ${(d.totalBagsDispatched ?? ((d.totalBagsSold ?? 0) + (d.totalDrawingBags ?? 0))).toLocaleString()} (${(d.totalBagsSold ?? 0).toLocaleString()} sold, ${(d.totalDrawingBags ?? 0).toLocaleString()} drawn)`}
          color={prodMinusSold >= 0 ? "border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10" : "border-red-500/20 bg-red-50/20 dark:bg-red-950/10"}
        />

        {/* 3. Total Amount in Debt */}
        <KpiCard 
          label="Total Amount in Debt (Unpaid)" 
          value={formatCurrency(d.totalDebt ?? 0)} 
          icon={<AlertCircle className="w-4 h-4 text-destructive" />}
          sub={`All-time debt: ${formatCurrency(d.totalAccumulatedDebt ?? 0)} (${d.totalDebtorsCount ?? 0} unpaid)`}
          color="border-red-500/30 bg-red-50/40 dark:bg-red-950/20"
          alert
        />

        {/* 4. Total Drawing */}
        <KpiCard 
          label="Total Drawing" 
          value={formatCurrency(d.totalDrawingAmount ?? 0)} 
          icon={<FileMinus className="w-4 h-4 text-purple-600" />}
          sub={`${(d.totalDrawingBags ?? 0).toLocaleString()} bags drawn (${formatCurrency(d.allTimeDrawingAmount ?? 0)} all-time)`}
          color="border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/10"
        />

        {/* 5. Actual Cash Collected */}
        <KpiCard 
          label="Actual Cash Collected" 
          value={formatCurrency(d.cashCollected ?? 0)} 
          icon={<Wallet className="w-4 h-4 text-blue-600" />}
          sub={`Received in cash/POS (vs ${formatCurrency(d.revenue ?? 0)} billed)`}
        />

        {/* 6. Water Expenses */}
        <KpiCard 
          label="Total Water Expenses" 
          value={formatCurrency(d.expenses ?? 0)} 
          icon={<Wallet className="w-4 h-4 text-rose-500" />}
          sub={`Prod cost: ${formatCurrency(d.productionCost ?? 0)} | Ops: ${formatCurrency(d.operationalExpenses ?? 0)}`}
        />

        {/* 7. Net Profit */}
        <KpiCard 
          label="Water Net Profit" 
          value={formatCurrency(d.netProfit ?? 0)} 
          icon={<ArrowUpRight className="w-4 h-4 text-emerald-600" />}
          sub="Revenue minus all production & operational costs"
          color="ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10"
        />

        {/* 8. Total Bags Produced & Waste */}
        <KpiCard 
          label="Total Bags Produced" 
          value={(d.totalBagsProduced ?? 0).toLocaleString()} 
          icon={<Package className="w-4 h-4 text-sky-500" />}
          sub={`Net good: ${(d.netBagsProduced ?? 0).toLocaleString()} | Waste: ${(d.totalBagsWasted ?? 0).toLocaleString()}`}
        />
      </div>

      {/* Production & Dispatches Stock Balance Quick Summary Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-background to-blue-500/10 border border-border rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-foreground text-base">Factory Warehouse Stock Balance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Period from <span className="font-semibold text-foreground">{fromDate}</span> to <span className="font-semibold text-foreground">{toDate}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            <div className="bg-background/80 backdrop-blur-xs border border-border rounded-xl p-2.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Produced</span>
              <p className="text-base font-black text-amber-600">{(d.totalBagsProduced ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-background/80 backdrop-blur-xs border border-border rounded-xl p-2.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Sold</span>
              <p className="text-base font-black text-blue-600">{(d.totalBagsSold ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-background/80 backdrop-blur-xs border border-border rounded-xl p-2.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Drawn</span>
              <p className="text-base font-black text-purple-600">{(d.totalDrawingBags ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-background/80 backdrop-blur-xs border border-border rounded-xl p-2.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Dispatched</span>
              <p className="text-base font-black text-indigo-600">{(d.totalBagsDispatched ?? ((d.totalBagsSold ?? 0) + (d.totalDrawingBags ?? 0))).toLocaleString()}</p>
            </div>
            <div className="bg-background/80 backdrop-blur-xs border border-border rounded-xl p-2.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stock Balance</span>
              <p className={cn("text-base font-black", prodMinusSold >= 0 ? "text-emerald-600" : "text-destructive")}>
                {prodMinusSold >= 0 ? '+' : ''}{prodMinusSold.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Production vs Sales trend */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground">Monthly Production vs Sales</h3>
              <p className="text-xs text-muted-foreground">Historical 6-month bag volume trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={d.productionChart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v.toLocaleString()} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="produced" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Bags Produced" />
              <Line type="monotone" dataKey="sold"     stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Bags Sold" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Area */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground">Revenue by Distribution Area</h3>
              <p className="text-xs text-muted-foreground">Selected period sales delivery destinations</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={d.salesByArea ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="area" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="total" name="Total Revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Production Table */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-foreground mb-4">Recent Production Batches</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {['Date', 'Bags Produced', 'Bags Wasted', 'Price / Bag', 'Liters Consumed', 'Production Cost', 'Notes'].map(h => (
                  <th key={h} className="pb-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(d.recentProduction ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-muted-foreground">No production logs in this date range.</td>
                </tr>
              ) : (
                (d.recentProduction ?? []).map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 text-foreground font-medium">{p.date}</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5 font-bold text-foreground">
                        <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        {Number(p.bags_produced).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {Number(p.bags_wasted || 0) > 0 ? (
                        <span className="text-destructive font-medium">{Number(p.bags_wasted).toLocaleString()}</span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      {Number(p.price_per_bag) > 0 ? formatCurrency(p.price_per_bag) : '—'}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{Number(p.liters_used || 0).toLocaleString()} L</td>
                    <td className="py-3 pr-4 font-semibold text-primary">{formatCurrency(p.cost)}</td>
                    <td className="py-3 text-muted-foreground text-xs max-w-xs truncate">{p.notes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
