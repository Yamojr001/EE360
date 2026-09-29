import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Bird, Droplets, ArrowUpRight, 
  Star, Scale, AlertCircle, FileMinus, Wallet, Calendar, RefreshCw, Layers 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];

function KpiCard({ label, value, icon, sub, color, alert }: any) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs', color)}>
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

export default function SuperAdminDashboard() {
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
    queryKey: ['super-summary', fromDate, toDate],
    queryFn: () => api.get('/dashboard/super-summary', { params: { from: fromDate, to: toDate } }).then(r => r.data),
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
      </div>
      <div className="h-64 bg-muted rounded-2xl" />
    </div>
  );

  const d = data ?? {};
  const waterProdMinusSold = d.waterProductionMinusSold ?? 0;

  return (
    <div className="space-y-6">
      {/* Header & Date Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-5 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            Command Centre <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h1>
          <p className="text-xs text-muted-foreground">Unified executive overview across Farm and Water business sectors</p>
        </div>

        {/* Date Filters */}
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
            <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-primary")} />
          </Button>
        </div>
      </div>

      {/* Top Combined Enterprise KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <KpiCard
          label="Total Business Revenue"
          value={formatCurrency(d.totalRevenue ?? 0)}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
          sub={`Farm: ${formatCurrency(d.farmRevenue ?? 0)} | Water: ${formatCurrency(d.waterRevenue ?? 0)}`}
        />

        {/* Total Expenses */}
        <KpiCard
          label="Total Operating Expenses"
          value={formatCurrency(d.totalExpenses ?? 0)}
          icon={<TrendingDown className="w-4 h-4 text-rose-500" />}
          sub="Combined farm overheads & water production costs"
        />

        {/* Combined Net Profit */}
        <KpiCard
          label="Combined Net Profit"
          value={formatCurrency(d.combinedNet ?? 0)}
          icon={<ArrowUpRight className="w-4 h-4 text-primary" />}
          color="ring-2 ring-primary/20 bg-primary/5"
          sub="Total business earnings after all costs"
        />

        {/* Total Amount in Debt */}
        <KpiCard
          label="Total Amount in Debt (Unpaid)"
          value={formatCurrency(d.totalDebt ?? 0)}
          icon={<AlertCircle className="w-4 h-4 text-destructive" />}
          sub={`Water Debt: ${formatCurrency(d.waterDebt ?? 0)} | Farm Debt: ${formatCurrency(d.farmDebt ?? 0)}`}
          color="border-red-500/30 bg-red-50/30 dark:bg-red-950/20"
          alert
        />
      </div>

      {/* Secondary Operations & Water Specific Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Water Money Earned from Price per Bag */}
        <KpiCard
          label="Water Revenue & Price/Bag"
          value={formatCurrency(d.waterRevenue ?? 0)}
          icon={<Droplets className="w-4 h-4 text-amber-500" />}
          sub={`${(d.waterBagsSold ?? 0).toLocaleString()} bags sold @ avg ${formatCurrency(d.waterAvgPricePerBag ?? 0)}/bag`}
        />

        {/* Water Production - Dispatched (Sold + Drawings) */}
        <KpiCard
          label="Water Production − Dispatched"
          value={`${waterProdMinusSold >= 0 ? '+' : ''}${waterProdMinusSold.toLocaleString()} bags`}
          icon={<Scale className="w-4 h-4 text-blue-500" />}
          sub={`Produced: ${(d.waterBagsProduced ?? 0).toLocaleString()} | Dispatched: ${(d.waterBagsDispatched ?? ((d.waterBagsSold ?? 0) + (d.waterDrawingBags ?? 0))).toLocaleString()} (${(d.waterBagsSold ?? 0).toLocaleString()} sold, ${(d.waterDrawingBags ?? 0).toLocaleString()} drawn)`}
          color={waterProdMinusSold >= 0 ? "border-blue-500/20 bg-blue-50/20 dark:bg-blue-950/10" : "border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10"}
        />

        {/* Total Drawing */}
        <KpiCard
          label="Total Drawings"
          value={formatCurrency(d.totalDrawingAmount ?? 0)}
          icon={<FileMinus className="w-4 h-4 text-purple-600" />}
          sub={`Water: ${formatCurrency(d.waterDrawingAmount ?? 0)} (${(d.waterDrawingBags ?? 0).toLocaleString()} bags) | Farm: ${formatCurrency(d.farmDrawingAmount ?? 0)}`}
          color="border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/10"
        />

        {/* Actual Cash Inflows */}
        <KpiCard
          label="Actual Cash Collected"
          value={formatCurrency(d.totalCashCollected ?? 0)}
          icon={<Wallet className="w-4 h-4 text-teal-600" />}
          sub={`Farm: ${formatCurrency(d.farmCashCollected ?? 0)} | Water: ${formatCurrency(d.waterCashCollected ?? 0)}`}
        />
      </div>

      {/* Sector breakdown quick cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {(d.sectorBreakdown ?? []).map((sec: any) => (
          <div key={sec.sector} className="bg-card border border-border rounded-2xl p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                {sec.sector === 'Farm' ? (
                  <div className="w-9 h-9 bg-purple-500/15 text-purple-600 rounded-xl flex items-center justify-center font-bold shadow-xs">
                    <Bird className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-amber-500/15 text-amber-600 rounded-xl flex items-center justify-center font-bold shadow-xs">
                    <Droplets className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-foreground text-base">{sec.sector} Sector</h3>
                  <p className="text-xs text-muted-foreground">{sec.workers} active personnel</p>
                </div>
              </div>
              <span className={cn('text-xs font-black px-3 py-1 rounded-full', sec.net >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-red-100 text-red-800')}>
                Net: {formatCurrency(sec.net)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted/40 rounded-xl p-2.5 text-center border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Sales Revenue</p>
                <p className="text-sm font-black text-foreground">{formatCurrency(sec.revenue)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-2.5 text-center border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Cash Paid</p>
                <p className="text-sm font-black text-emerald-600">{formatCurrency(sec.cash_collected)}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-2.5 text-center border border-border">
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">Expenses</p>
                <p className="text-sm font-black text-rose-500">{formatCurrency(sec.expenses)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-2.5 text-center border border-red-200/50 dark:border-red-900/40">
                <p className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400 mb-0.5">Unpaid Debt</p>
                <p className="text-sm font-black text-red-600 dark:text-red-300">{formatCurrency(sec.debt ?? 0)}</p>
              </div>
              <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-2.5 text-center border border-purple-200/50 dark:border-purple-900/40">
                <p className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 mb-0.5">Drawings</p>
                <p className="text-sm font-black text-purple-600 dark:text-purple-300">{formatCurrency(sec.drawings ?? 0)}</p>
              </div>
            </div>

            {/* Extra Water Metrics */}
            {sec.sector === 'Water' && (
              <div className="bg-amber-50/40 dark:bg-amber-950/20 rounded-xl p-2.5 border border-amber-200/50 dark:border-amber-900/40 text-xs flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground">Stock Balance: </span>
                  <span className="font-bold text-foreground">
                    {sec.net_balance >= 0 ? '+' : ''}{sec.net_balance?.toLocaleString()} bags
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1.5 font-medium">
                    ({(sec.bags_sold ?? 0).toLocaleString()} sold, {(sec.bags_drawn ?? 0).toLocaleString()} drawn)
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg: </span>
                  <span className="font-bold text-amber-600">{formatCurrency(sec.avg_price ?? 0)}/bag</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Combined monthly revenue */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-foreground mb-1">Monthly Revenue by Sector</h3>
          <p className="text-xs text-muted-foreground mb-4">Farm (Purple) vs Water (Gold) — last 6 months</p>
          <ResponsiveContainer width="100%" height={230}>
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
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Legend />
              <Area type="monotone" dataKey="farm_revenue"  stroke="#8b5cf6" fill="url(#farmGrad)"  name="Farm Revenue" strokeWidth={2.5} />
              <Area type="monotone" dataKey="water_revenue" stroke="#f59e0b" fill="url(#waterGrad)" name="Water Revenue" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector net profit contribution */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-foreground mb-1">Sector Profit Contribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Share of total enterprise net profit</p>
          <ResponsiveContainer width="100%" height={230}>
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
