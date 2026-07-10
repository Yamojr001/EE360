import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Bird, ShoppingCart, Wallet, Package, Users, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

function KpiCard({ label, value, icon, sub }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-2xl font-extrabold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function FarmDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['farm-summary'],
    queryFn: () => api.get('/dashboard/farm-summary').then(r => r.data),
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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <Bird className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Farm Dashboard</h1>
          <p className="text-sm text-muted-foreground">Livestock & crop operations</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Farm Revenue"    value={formatCurrency(d.revenue)}  icon={<TrendingUp className="w-4 h-4" />}  />
        <KpiCard label="Farm Expenses"   value={formatCurrency(d.expenses)} icon={<Wallet className="w-4 h-4" />}      />
        <KpiCard label="Net Profit"      value={formatCurrency(d.netProfit)}icon={<ArrowUpRight className="w-4 h-4" />}/>
        <KpiCard label="Total Animals"   value={d.totalAnimals ?? '—'}      icon={<Bird className="w-4 h-4" />} sub={`${d.lowStock ?? 0} low-stock items`}/>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Revenue trend */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Revenue vs Expenses</h3>
          <p className="text-xs text-muted-foreground mb-4">Farm sector — last 7 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={d.monthlyChart ?? []}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="oklch(0.52 0.18 175)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.52 0.18 175)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Legend />
              <Area type="monotone" dataKey="revenue"  stroke="oklch(0.52 0.18 175)" fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="oklch(0.62 0.20 30)"  fill="none"          name="Expenses" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by category */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground mb-1">Revenue by Category</h3>
          <p className="text-xs text-muted-foreground mb-4">What's selling the most</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.salesByCategory ?? []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0 0)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={65} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} />
              <Bar dataKey="total" name="Revenue" fill="oklch(0.52 0.18 175)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Animal breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-foreground mb-4">Livestock by Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(d.animalByType ?? []).map((a: any) => (
            <div key={a.type} className="bg-muted/40 rounded-xl p-3 text-center border border-border">
              <p className="text-2xl font-extrabold text-primary">{a.count.toLocaleString()}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5 capitalize">{a.type}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(a.value)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sales */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Recent Farm Sales</h3>
          <span className="text-xs text-muted-foreground">Latest transactions</span>
        </div>
        <div className="space-y-1">
          {(d.recentSales ?? []).map((s: any) => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.item}</p>
                <p className="text-xs text-muted-foreground">{s.buyer} · {s.date}</p>
              </div>
              <span className="text-sm font-semibold text-primary">{formatCurrency(s.total_amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
